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
import { groupItemsByDay } from "./utils";

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
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [sending, setSending] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const prevItemCountRef = useRef(items.length);
  const isFirstRender = useRef(true);

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

  // Scroll to bottom on initial load or when new items are added at the bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isFirstRender.current && items.length > 0) {
      // Initial render: scroll to bottom
      container.scrollTop = container.scrollHeight;
      isFirstRender.current = false;
    } else if (items.length > prevItemCountRef.current) {
      // New items added - check if they're at the bottom (newer)
      const lastPrevItem = prevItemCountRef.current > 0;
      if (lastPrevItem) {
        // If user is near bottom, auto-scroll
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;
        if (isNearBottom) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }

    prevItemCountRef.current = items.length;
  }, [items]);

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
  }, [hasMore, loadingMore]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        200;
      setShowScrollDown(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleScrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
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
    async (date: Date) => {
      setSelectedDate(date);
      setShowCalendar(true);
      if (callbacks.onFetchDates) {
        setCalendarLoading(true);
        try {
          const markers = await callbacks.onFetchDates(date);
          setDateMarkers(markers);
        } finally {
          setCalendarLoading(false);
        }
      }
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
        // Scroll to bottom after sending
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }, 100);
      } finally {
        setSending(false);
      }
    },
    [callbacks],
  );

  const handleCalendarToggle = useCallback(async () => {
    if (showCalendar) {
      setShowCalendar(false);
      return;
    }
    setShowCalendar(true);
    if (callbacks.onFetchDates) {
      setCalendarLoading(true);
      try {
        const markers = await callbacks.onFetchDates(new Date());
        setDateMarkers(markers);
      } finally {
        setCalendarLoading(false);
      }
    }
  }, [showCalendar, callbacks]);

  const handleMonthChange = useCallback(
    async (month: Date) => {
      if (callbacks.onFetchDates) {
        setCalendarLoading(true);
        try {
          const markers = await callbacks.onFetchDates(month);
          setDateMarkers(markers);
        } finally {
          setCalendarLoading(false);
        }
      }
    },
    [callbacks],
  );

  const handleDateSelect = useCallback(
    async (date: Date) => {
      setSelectedDate(date);
      setShowCalendar(false);
      if (callbacks.onNavigateToDate) {
        await callbacks.onNavigateToDate(date);
        // The parent will update items, and we should scroll to those items
        // We'll scroll to top since navigated items are loaded
        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (container) {
            container.scrollTop = 0;
          }
        }, 50);
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
      className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden ${fullscreenClasses} ${className}`}
    >
      {/* Header area */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex-1">{headerContent}</div>
        <div className="flex items-center gap-2">
          {/* Calendar toggle */}
          {callbacks.onFetchDates && (
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
                    onClick={() => setShowCalendar(false)}
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
          )}

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
        {!hasMore && !loading && items.length > 0 && (
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
        {loading ? (
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
            const dayDate = dayItems[0]?.timestamp
              ? new Date(dayItems[0].timestamp)
              : new Date();
            return (
              <div key={dayLabel}>
                <ChatDaySeparator
                  label={dayLabel}
                  onClick={() => handleDayLabelClick(dayDate)}
                />
                {dayItems.map((item) => (
                  <div
                    key={`${item.id}-${item.isQueued ? "q" : "s"}`}
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
