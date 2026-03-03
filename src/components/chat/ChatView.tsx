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
  const prevItemCountRef = useRef(items.length);
  const isFirstRender = useRef(true);

  // Group items by day
  const dayGroups = useMemo(
    () => groupItemsByDay(items, timezone),
    [items, timezone],
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

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-800 overflow-hidden ${className}`}
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
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 min-h-75 max-h-150 relative"
      >
        {/* Load more sentinel (at top) */}
        {hasMore && <div ref={loadMoreSentinelRef} className="h-1 w-full" />}

        {/* Loading more indicator */}
        {loadingMore && (
          <div className="flex justify-center py-3">
            <Spinner size="sm" />
          </div>
        )}

        {/* Main content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="xl" />
            <span className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading communications...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
            <MessageSquareOff className="w-12 h-12 mb-3" />
            <span className="text-sm">{emptyMessage}</span>
          </div>
        ) : (
          dayGroups.map(([dayLabel, dayItems]) => (
            <div key={dayLabel}>
              <ChatDaySeparator label={dayLabel} />
              {dayItems.map((item) => (
                <ChatBubble
                  key={`${item.id}-${item.isQueued ? "q" : "s"}`}
                  item={item}
                  timezone={timezone}
                  permissions={permissions}
                  onItemClick={callbacks.onItemClick}
                  onCancelQueued={callbacks.onCancelQueued}
                  onSendQueuedNow={callbacks.onSendQueuedNow}
                  onResend={callbacks.onResend}
                />
              ))}
            </div>
          ))
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
        />
      )}
    </div>
  );
};

export default ChatView;
