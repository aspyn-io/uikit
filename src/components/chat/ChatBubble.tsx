import React, { useState } from "react";
import {
  Mail,
  MessageSquare,
  Clock,
  AlertCircle,
  Paperclip,
  Bot,
  User,
  ExternalLink,
  CalendarClock,
  Check,
  CheckCheck,
  XCircle,
  RotateCw,
} from "lucide-react";
import { Badge, Tooltip } from "flowbite-react";
import type { ChatItem, ChatPermissions } from "./types";
import {
  formatTime,
  formatScheduledTime,
  formatContact,
  truncate,
} from "./utils";

interface ChatBubbleProps {
  item: ChatItem;
  timezone?: string;
  permissions?: ChatPermissions;
  onItemClick?: (item: ChatItem) => void;
  onCancelQueued?: (item: ChatItem) => Promise<void>;
  onSendQueuedNow?: (item: ChatItem) => Promise<void>;
  onResend?: (item: ChatItem) => Promise<void>;
}

const statusIcon = (status: string) => {
  switch (status) {
    case "sent":
      return <Check className="w-3 h-3 text-gray-400" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    case "failed":
      return <XCircle className="w-3 h-3 text-red-500" />;
    case "processing":
      return <RotateCw className="w-3 h-3 text-yellow-500 animate-spin" />;
    case "skipped":
      return <XCircle className="w-3 h-3 text-gray-400" />;
    default:
      return null;
  }
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  item,
  timezone,
  permissions,
  onItemClick,
  onCancelQueued,
  onSendQueuedNow,
  onResend,
}) => {
  const isOutbound = item.direction === "outbound";
  const isEmail = item.channel === "email";
  const isQueued = item.isQueued;
  const [confirmAction, setConfirmAction] = useState<
    "cancel" | "sendNow" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleClick = () => {
    onItemClick?.(item);
  };

  const handleCancelQueued = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction("cancel");
  };

  const handleSendNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction("sendNow");
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(true);
    try {
      if (confirmAction === "cancel") {
        await onCancelQueued?.(item);
      } else if (confirmAction === "sendNow") {
        await onSendQueuedNow?.(item);
      }
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const handleDismissConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction(null);
  };

  const handleResend = (e: React.MouseEvent) => {
    e.stopPropagation();
    onResend?.(item);
  };

  return (
    <div
      className={`flex ${isOutbound ? "justify-end" : "justify-start"} mb-2 group`}
    >
      <div
        className={`max-w-[75%] min-w-50 ${onItemClick ? "cursor-pointer" : ""}`}
        onClick={onItemClick ? handleClick : undefined}
      >
        {/* Sender info line */}
        {isOutbound && (
          <div className="flex items-center justify-end gap-1.5 mb-1 px-1">
            {item.sender ? (
              <>
                {item.sender.isSystem ? (
                  <Bot className="w-3 h-3 text-gray-400" />
                ) : (
                  <User className="w-3 h-3 text-gray-400" />
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {item.sender.name}
                </span>
              </>
            ) : (
              <>
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Sent by User
                </span>
              </>
            )}
          </div>
        )}

        {/* Main bubble */}
        <div
          className={`
            relative rounded-2xl px-4 py-2.5 shadow-sm
            transition-colors duration-150
            ${
              isQueued
                ? "border-2 border-dashed border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
                : isOutbound
                  ? "bg-blue-500 dark:bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            }
            ${
              onItemClick
                ? isQueued
                  ? "hover:bg-yellow-100 dark:hover:bg-yellow-950/50"
                  : isOutbound
                    ? "hover:bg-blue-600 dark:hover:bg-blue-700"
                    : "hover:bg-gray-200 dark:hover:bg-gray-600"
                : ""
            }
            ${isOutbound ? "rounded-br-md" : "rounded-bl-md"}
          `}
        >
          {/* Scheduled badge */}
          {isQueued && item.scheduledAt && (
            <div className="flex items-center gap-1 mb-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 flex-1">
                {formatScheduledTime(item.scheduledAt, timezone)}
              </span>
              {onItemClick && (
                <ExternalLink className="w-3 h-3 text-yellow-600 dark:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              )}
            </div>
          )}

          {/* Channel indicator + contact */}
          <div className="flex items-center gap-1.5 mb-1">
            {isEmail ? (
              <Mail
                className={`w-3.5 h-3.5 shrink-0 ${
                  isQueued
                    ? "text-yellow-600 dark:text-yellow-400"
                    : isOutbound
                      ? "text-blue-200"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              />
            ) : (
              <MessageSquare
                className={`w-3.5 h-3.5 shrink-0 ${
                  isQueued
                    ? "text-yellow-600 dark:text-yellow-400"
                    : isOutbound
                      ? "text-blue-200"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              />
            )}
            <span
              className={`text-xs ${
                isQueued
                  ? "text-yellow-600 dark:text-yellow-400"
                  : isOutbound
                    ? "text-blue-100"
                    : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {isOutbound ? "To: " : "From: "}
              {formatContact(item.contact)}
            </span>
          </div>

          {/* Email subject line */}
          {isEmail && (item.subject || item.templateName) && (
            <div
              className={`text-xs font-semibold mb-1 ${
                isQueued
                  ? "text-yellow-800 dark:text-yellow-300"
                  : isOutbound
                    ? "text-blue-100"
                    : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {item.subject || item.templateName}
            </div>
          )}

          {/* Message body (skip for emails with subject already displayed) */}
          {!(isEmail && item.subject) && (
            <div
              className={`text-sm leading-relaxed wrap-break-word ${
                isQueued ? "text-gray-800 dark:text-gray-200" : ""
              }`}
            >
              {isEmail && !item.body
                ? item.templateName || "Email"
                : truncate(item.body || "No content", 300)}
            </div>
          )}

          {/* Bottom row: time, status, attachments */}
          <div
            className={`flex items-center gap-2 mt-1.5 ${
              isOutbound ? "justify-end" : "justify-start"
            }`}
          >
            {/* Attachments indicator */}
            {item.hasAttachments && (
              <Tooltip content={`${item.attachmentCount || 1} attachment(s)`}>
                <div className="flex items-center gap-0.5">
                  <Paperclip
                    className={`w-3 h-3 ${
                      isQueued
                        ? "text-yellow-600 dark:text-yellow-400"
                        : isOutbound
                          ? "text-blue-200"
                          : "text-gray-400"
                    }`}
                  />
                  {(item.attachmentCount ?? 0) > 1 && (
                    <span
                      className={`text-xs ${
                        isQueued
                          ? "text-yellow-600 dark:text-yellow-400"
                          : isOutbound
                            ? "text-blue-200"
                            : "text-gray-400"
                      }`}
                    >
                      {item.attachmentCount}
                    </span>
                  )}
                </div>
              </Tooltip>
            )}

            {/* Communication type badge */}
            {item.communicationType && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isQueued
                    ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                    : isOutbound
                      ? "bg-blue-400/30 text-blue-100"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                }`}
              >
                {item.communicationType}
              </span>
            )}

            {/* Timestamp - hide for scheduled items since time is already in the scheduled badge */}
            {!(isQueued && item.scheduledAt) && (
              <span
                className={`text-[10px] ${
                  isQueued
                    ? "text-yellow-600 dark:text-yellow-400"
                    : isOutbound
                      ? "text-blue-200"
                      : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {formatTime(item.timestamp, timezone)}
              </span>
            )}

            {/* Status icon */}
            {isOutbound && !isQueued && statusIcon(item.status)}

            {/* Click hint - only for non-queued items (queued items show it on the scheduled line) */}
            {onItemClick && !isQueued && (
              <ExternalLink
                className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isOutbound ? "text-blue-200" : "text-gray-400"
                }`}
              />
            )}
          </div>

          {/* Error message for failed items */}
          {item.status === "failed" && item.errorMessage && (
            <div className="flex items-center gap-1 mt-1.5 px-2 py-1 rounded bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
              <span className="text-xs text-red-600 dark:text-red-400">
                {truncate(item.errorMessage, 100)}
              </span>
            </div>
          )}

          {/* Queued item actions */}
          {isQueued && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-yellow-300 dark:border-yellow-600">
              {confirmAction ? (
                <>
                  <span className="text-xs text-yellow-700 dark:text-yellow-400">
                    {confirmAction === "cancel"
                      ? "Cancel this communication?"
                      : "Send this communication now?"}
                  </span>
                  <button
                    onClick={handleConfirm}
                    disabled={actionLoading}
                    className={`text-xs font-medium hover:underline ${
                      confirmAction === "cancel"
                        ? "text-red-600 dark:text-red-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {actionLoading ? "..." : "Yes"}
                  </button>
                  <button
                    onClick={handleDismissConfirm}
                    disabled={actionLoading}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    No
                  </button>
                </>
              ) : (
                <>
                  {permissions?.canCancelQueued && onCancelQueued && (
                    <button
                      onClick={handleCancelQueued}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                  {onSendQueuedNow && (
                    <button
                      onClick={handleSendNow}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Send Now
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Failed item resend action */}
          {!isQueued &&
            item.status === "failed" &&
            permissions?.canResend &&
            onResend && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                <button
                  onClick={handleResend}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Resend
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
