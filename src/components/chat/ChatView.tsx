import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Spinner } from "flowbite-react";
import {
  Calendar as CalendarIcon,
  ArrowDown,
  MessageSquareOff,
  Maximize2,
  Minimize2,
  Clock,
  History,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import type {
  ChatViewProps,
  ChatItem,
  ChatDateMarker,
  ChatComposePayload,
} from "./types";
import { ChatBubble } from "./ChatBubble";
import { ChatDaySeparator } from "./ChatDaySeparator";
import { ChatComposeBar } from "./ChatComposeBar";
import { ChatCalendar } from "./ChatCalendar";
import { groupItemsByDay, getDayKey } from "./utils";

/**
 * ChatView - A chat-style view for displaying communications.
 *
 * Displays inbound messages on the left, outbound on the right,
 * grouped by day with separators. Supports infinite scroll (load older),
 * sending, scheduling, calendar navigation, and item click handling.
 */
export const ChatView: React.FC<ChatViewProps> = ({
  items,
  hasMore,
  loading = false,
  refreshing = false,
  navigatingToDate = false,
  contacts,
  permissions,
  timezone,
  callbacks,
  className = "",
  emptyMessage = "No communications yet",
  headerContent,
  renderDatePicker,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [dateMarkers, setDateMarkers] = useState<ChatDateMarker[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // The month currently visible in the calendar popup (null when closed).
  const [calendarMonth, setCalendarMonth] = useState<Date | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [sending, setSending] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const prevItemCountRef = useRef(items.length);
  const isFirstRender = useRef(true);
  // Keep a stable ref to the latest callbacks so the marker-fetch effect
  // never uses a stale closure.
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  // ── Reactive calendar-marker fetching ──────────────────────────────
  // Whenever the calendar is open *and* the visible month changes, fetch
  // date markers through the parent-supplied callback.  Uses a single
  // useEffect so there is exactly one code-path for fetching, with
  // automatic cancellation when the month changes again before the
  // previous fetch resolves.
  useEffect(() => {
    if (!showCalendar || !calendarMonth) return;

    const onFetchDates = callbacksRef.current.onFetchDates;
    if (!onFetchDates) return;

    let cancelled = false;
    setCalendarLoading(true);

    onFetchDates(calendarMonth)
      .then((markers) => {
        if (!cancelled) setDateMarkers(markers);
      })
      .catch(() => {
        // Errors are already handled inside onFetchDates (fallback).
        // Swallow here so React doesn't see an unhandled rejection.
      })
      .finally(() => {
        if (!cancelled) setCalendarLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [showCalendar, calendarMonth]);

  // Group items by day
  const dayGroups = useMemo(
    () => groupItemsByDay(items, timezone),
    [items, timezone],
  );

  // Count queued/scheduled items
  const queuedCount = useMemo(
    () => items.filter((item) => item.isQueued).length,
    [items],
  );

  // Scroll ONLY the inner container so the last real (non-queued) message is
  // fully visible at the bottom.
  //
  // Strategy: find the first queued item via data attribute and scroll so its
  // top aligns exactly with the container's bottom edge. This guarantees the
  // last real message is fully visible regardless of its rendered height.
  // If no queued items exist, scroll to the absolute bottom.
  const scrollToLastRealMessage = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const firstQueued = container.querySelector(
        "[data-chat-queued]",
      ) as HTMLElement | null;
      // Use the day-group ancestor so the date separator for future/queued
      // items is also hidden (it renders above the first queued bubble).
      const anchor = firstQueued
        ? ((firstQueued.closest("[data-day-date]") as HTMLElement | null) ??
          firstQueued)
        : null;
      const target = anchor
        ? Math.max(0, anchor.offsetTop - container.clientHeight)
        : Math.max(0, container.scrollHeight - container.clientHeight);
      if (behavior === "instant") {
        container.scrollTop = target;
      } else {
        container.scrollTo({ top: target, behavior });
      }
    },
    [],
  );

  // Scroll to last real message on initial load or when new items are added at the bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isFirstRender.current && items.length > 0) {
      isFirstRender.current = false;

      // Use ResizeObserver to wait until the container actually has a rendered
      // height before scrolling — the same code path as the "Scroll to bottom"
      // button, which is known to work correctly.
      const doScroll = () => scrollToLastRealMessage("instant");

      if (container.clientHeight > 0) {
        // Container already laid out (e.g. re-mount); scroll immediately.
        requestAnimationFrame(doScroll);
      } else {
        // Container height is 0 — layout hasn't resolved yet (common on first
        // mount when the parent is still expanding). Wait for it.
        const ro = new ResizeObserver(() => {
          if (container.clientHeight > 0) {
            ro.disconnect();
            requestAnimationFrame(doScroll);
          }
        });
        ro.observe(container);
        // Cleanup in case the component unmounts before height resolves
        return () => ro.disconnect();
      }
    } else if (items.length > prevItemCountRef.current) {
      // New items added - check if they're at the bottom (newer)
      const lastPrevItem = prevItemCountRef.current > 0;
      if (lastPrevItem) {
        // If user is near bottom, auto-scroll to last real message
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;
        if (isNearBottom) {
          scrollToLastRealMessage("instant");
        }
      }
    }

    prevItemCountRef.current = items.length;
  }, [items, scrollToLastRealMessage]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const container = scrollContainerRef.current;
    const prevScrollHeight = container?.scrollHeight || 0;

    try {
      await callbacks.onLoadMore();
    } finally {
      setLoadingMore(false);

      // Maintain scroll position after prepending older items
      if (container) {
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        });
      }
    }
  }, [loadingMore, hasMore, callbacks]);

  // Observe the load-more sentinel (top of scroll area)
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const sentinel = loadMoreSentinelRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          handleLoadMore();
        }
      },
      {
        root: container,
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, handleLoadMore]);

  // Track scroll position for "scroll to bottom" button.
  // Hide once the last real message's bottom is within the visible area.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const firstQueued = container.querySelector(
        "[data-chat-queued]",
      ) as HTMLElement | null;
      if (firstQueued) {
        // Use day-group ancestor so the date separator is included
        const anchor =
          (firstQueued.closest("[data-day-date]") as HTMLElement | null) ??
          firstQueued;
        const anchorTop = anchor.offsetTop;
        const visibleBottom = container.scrollTop + container.clientHeight;
        setShowScrollDown(anchorTop > visibleBottom + 50);
      } else {
        const distFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        setShowScrollDown(distFromBottom > 100);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToBottom = () => {
    scrollToLastRealMessage("smooth");
  };

  const handleScrollToQueued = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const firstQueued = container.querySelector("[data-chat-queued]");
    if (firstQueued) {
      firstQueued.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleDayLabelClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      // Open the calendar to the clicked date's month — the useEffect
      // will automatically fetch markers for that month.
      const month = new Date(date.getFullYear(), date.getMonth(), 1);
      setCalendarMonth(month);
      setShowCalendar(true);
      callbacks.onDayLabelClick?.(date);
    },
    [callbacks],
  );

  const handleSend = useCallback(
    async (payload: ChatComposePayload) => {
      if (!callbacks.onSend) return;
      setSending(true);
      try {
        await callbacks.onSend(payload);
        // Scroll to last real message after sending
        setTimeout(() => {
          scrollToLastRealMessage("smooth");
        }, 100);
      } finally {
        setSending(false);
      }
    },
    [callbacks],
  );

  const handleCalendarToggle = useCallback(() => {
    if (showCalendar) {
      setShowCalendar(false);
      setCalendarMonth(null);
      return;
    }
    // Compute the initial month for the calendar popup.
    // If a date was previously selected, open to that month; otherwise
    // open to the current month.
    const initialMonth = selectedDate
      ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      : new Date();
    setCalendarMonth(initialMonth);
    setShowCalendar(true);
  }, [showCalendar, selectedDate]);

  // Called by ChatCalendar when the user navigates to a different month.
  // Sets state only — the useEffect above reacts to the change and fetches.
  const handleMonthChange = useCallback((month: Date) => {
    setCalendarMonth(month);
  }, []);

  const handleDateSelect = useCallback(
    async (date: Date) => {
      setSelectedDate(date);
      setShowCalendar(false);
      setCalendarMonth(null);
      // The calendar date is a browser-local Date representing the visual day
      // the user clicked.  format() uses the local representation, so this
      // always gives the correct "yyyy-MM-dd" string without timezone conversion.
      const dayKey = format(date, "yyyy-MM-dd");

      const scrollToDay = (
        container: HTMLElement,
        behavior: ScrollBehavior,
      ) => {
        const el = container.querySelector(
          `[data-day-date="${dayKey}"]`,
        ) as HTMLElement | null;
        const fallback = (() => {
          const all = Array.from(
            container.querySelectorAll("[data-day-date]"),
          ).map((e) => ({
            el: e as HTMLElement,
            d: e.getAttribute("data-day-date")!,
          }));
          return (
            (all.find((x) => x.d >= dayKey) ?? all[all.length - 1])?.el ?? null
          );
        })();
        const target = el ?? fallback;
        if (target) {
          // Scroll so the day label sits ~8px below the container top
          const offset = target.offsetTop - 8;
          container.scrollTo({ top: Math.max(0, offset), behavior });
        }
      };

      if (callbacks.onNavigateToDate) {
        await callbacks.onNavigateToDate(date);
        // After items are replaced, scroll to the target day
        requestAnimationFrame(() => {
          const container = scrollContainerRef.current;
          if (!container) return;
          setTimeout(() => scrollToDay(container, "instant"), 50);
        });
      } else {
        const container = scrollContainerRef.current;
        if (container) {
          scrollToDay(container, "smooth");
        }
      }
    },
    [callbacks],
  );

  const canSendAnything =
    permissions?.canSendMessage || permissions?.canSendEmail;

  const fullscreenClasses = isFullscreen
    ? "fixed inset-0 z-50 rounded-none"
    : "";

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden ${fullscreenClasses} ${isFullscreen ? "" : className}`}
    >
      {/* Header area */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex-1">{headerContent}</div>
        <div className="flex items-center gap-2">
          {/* Calendar toggle */}
          <div className="relative">
            <button
              onClick={handleCalendarToggle}
              className={`p-2 rounded-lg transition-colors ${
                showCalendar
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Navigate to date"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            {showCalendar && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setShowCalendar(false);
                    setCalendarMonth(null);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 z-50">
                  <ChatCalendar
                    dateMarkers={dateMarkers}
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    onMonthChange={handleMonthChange}
                    loading={calendarLoading}
                  />
                </div>
              </>
            )}
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Scheduled items indicator - clickable to scroll to first queued */}
      {queuedCount > 0 && (
        <button
          onClick={handleScrollToQueued}
          className="flex items-center gap-2 px-4 py-2 w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer text-left"
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span className="text-xs font-medium">
            {queuedCount} scheduled communication{queuedCount !== 1 ? "s" : ""}{" "}
            — click to view
          </span>
        </button>
      )}

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-4 py-4 relative min-h-0 ${
          isFullscreen ? "" : "min-h-48"
        }`}
      >
        {/* Load more sentinel (at top) */}
        {hasMore && <div ref={loadMoreSentinelRef} className="h-1 w-full" />}

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="space-y-3 py-3 animate-pulse">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`rounded-2xl p-3 ${i % 2 === 0 ? "bg-gray-100 dark:bg-gray-700/50" : "bg-blue-50 dark:bg-blue-900/20"}`}
                >
                  <div className="h-2.5 w-32 rounded bg-gray-200 dark:bg-gray-600" />
                  <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-gray-600 mt-1.5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Beginning of conversation marker */}
        {!hasMore && !loading && !navigatingToDate && items.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-700/50">
              <History className="w-3.5 h-3.5" />
              Beginning of conversation
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>
        )}

        {/* Main content */}
        {loading || navigatingToDate ? (
          <div className="space-y-4 py-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className="space-y-1.5">
                  <div
                    className={`h-2.5 w-16 rounded ${i % 2 === 0 ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-200 dark:bg-gray-700 ml-auto"}`}
                  />
                  <div
                    className={`rounded-2xl p-4 space-y-2 ${i % 2 === 0 ? "bg-gray-100 dark:bg-gray-700/50" : "bg-blue-50 dark:bg-blue-900/20"}`}
                  >
                    <div
                      className={`h-2.5 rounded ${i % 2 === 0 ? "bg-gray-200 dark:bg-gray-600" : "bg-blue-100 dark:bg-blue-800/40"}`}
                      style={{ width: `${140 + ((i * 37) % 100)}px` }}
                    />
                    <div
                      className={`h-2.5 rounded ${i % 2 === 0 ? "bg-gray-200 dark:bg-gray-600" : "bg-blue-100 dark:bg-blue-800/40"}`}
                      style={{ width: `${80 + ((i * 53) % 120)}px` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <MessageSquareOff className="w-12 h-12 mb-3" />
            <span className="text-sm">{emptyMessage}</span>
          </div>
        ) : (
          dayGroups.map(([dayLabel, dayItems]) => {
            // Use the same timezone-aware getDayKey used by groupItemsByDay so
            // that data-day-date attributes match what handleDateSelect looks up.
            const dayKey = dayItems[0]?.timestamp
              ? getDayKey(dayItems[0].timestamp, timezone)
              : format(new Date(), "yyyy-MM-dd");
            // Build a browser-local Date for the calendar from the day key
            const dayDate = parseISO(dayKey + "T12:00:00");
            return (
              <div key={dayKey} data-day-date={dayKey}>
                <ChatDaySeparator
                  label={dayLabel}
                  onClick={() => handleDayLabelClick(dayDate)}
                />
                {dayItems.map((item) => (
                  <div
                    key={`${item.id}-${item.isQueued ? "q" : "s"}`}
                    data-chat-item-id={item.id}
                    data-chat-queued={item.isQueued || undefined}
                  >
                    <ChatBubble
                      item={item}
                      timezone={timezone}
                      permissions={permissions}
                      onItemClick={callbacks.onItemClick}
                      onCancelQueued={callbacks.onCancelQueued}
                      onSendQueuedNow={callbacks.onSendQueuedNow}
                      onResend={callbacks.onResend}
                    />
                  </div>
                ))}
              </div>
            );
          })
        )}

        {/* Refreshing overlay */}
        {refreshing && !loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollDown && items.length > 0 && (
        <div className="relative">
          <button
            onClick={handleScrollToBottom}
            className="absolute right-4 -top-12 p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors z-10"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Compose bar */}
      {canSendAnything && callbacks.onSend && (
        <ChatComposeBar
          contacts={contacts}
          permissions={permissions}
          onSend={handleSend}
          sending={sending}
          renderDatePicker={renderDatePicker}
        />
      )}
    </div>
  );
};

export default ChatView;
