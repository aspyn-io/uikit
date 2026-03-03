import React, { useState, useRef, useCallback } from "react";
import {
  Send,
  CalendarClock,
  Mail,
  MessageSquare,
  ChevronDown,
  X,
} from "lucide-react";
import { Tooltip } from "flowbite-react";
import type { ChatChannel, ChatComposePayload, ChatPermissions } from "./types";
import { formatContact } from "./utils";

interface ChatComposeBarProps {
  /** Available contacts for sending */
  contacts?: {
    phoneNumbers: string[];
    emails: string[];
  };
  /** Permissions */
  permissions?: ChatPermissions;
  /** Called when a message is sent */
  onSend: (payload: ChatComposePayload) => Promise<void>;
  /** Whether sending is in progress */
  sending?: boolean;
}

/**
 * The compose bar at the bottom of the chat.
 * Allows typing and sending messages or emails, with optional scheduling.
 */
export const ChatComposeBar: React.FC<ChatComposeBarProps> = ({
  contacts,
  permissions,
  onSend,
  sending = false,
}) => {
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [channel, setChannel] = useState<ChatChannel>("message");
  const [selectedContact, setSelectedContact] = useState<string>("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [showContactPicker, setShowContactPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend =
    (channel === "message" && permissions?.canSendMessage) ||
    (channel === "email" && permissions?.canSendEmail);

  const canSchedule =
    (channel === "message" && permissions?.canScheduleMessage) ||
    (channel === "email" && permissions?.canScheduleEmail);

  // Auto-select first contact when channel changes
  const availableContacts =
    channel === "message"
      ? contacts?.phoneNumbers || []
      : contacts?.emails || [];

  const currentContact = selectedContact || availableContacts[0] || "";

  const handleSend = useCallback(async () => {
    if (!body.trim() || !currentContact || sending) return;

    const payload: ChatComposePayload = {
      channel,
      to: currentContact,
      body: body.trim(),
      ...(channel === "email" && subject ? { subject } : {}),
      ...(showSchedule && scheduledAt
        ? {
            schedule: true,
            scheduledAt: new Date(scheduledAt).toISOString(),
          }
        : {}),
    };

    await onSend(payload);
    setBody("");
    setSubject("");
    setShowSchedule(false);
    setScheduledAt("");
  }, [
    body,
    subject,
    channel,
    currentContact,
    showSchedule,
    scheduledAt,
    sending,
    onSend,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  if (!canSend) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
      {/* Schedule row */}
      {showSchedule && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <CalendarClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Schedule for:
          </span>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={() => {
              setShowSchedule(false);
              setScheduledAt("");
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Channel and contact selector */}
      <div className="flex items-center gap-2 mb-2">
        {/* Channel toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          {permissions?.canSendMessage && (
            <button
              onClick={() => {
                setChannel("message");
                setSelectedContact("");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                channel === "message"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              SMS
            </button>
          )}
          {permissions?.canSendEmail && (
            <button
              onClick={() => {
                setChannel("email");
                setSelectedContact("");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                channel === "email"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Mail className="w-3 h-3" />
              Email
            </button>
          )}
        </div>

        {/* Contact selector */}
        {availableContacts.length > 1 ? (
          <div className="relative">
            <button
              onClick={() => setShowContactPicker(!showContactPicker)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <span>{formatContact(currentContact)}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showContactPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowContactPicker(false)}
                />
                <div className="absolute bottom-full mb-1 left-0 z-50 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 min-w-50">
                  {availableContacts.map((contact) => (
                    <button
                      key={contact}
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowContactPicker(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-600 ${
                        contact === currentContact
                          ? "text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {formatContact(contact)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : currentContact ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            To: {formatContact(currentContact)}
          </span>
        ) : (
          <span className="text-xs text-red-500">
            No {channel === "message" ? "phone numbers" : "email addresses"}{" "}
            available
          </span>
        )}
      </div>

      {/* Email subject line */}
      {channel === "email" && (
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject..."
          className="w-full mb-2 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      )}

      {/* Message input and send */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={
            channel === "message"
              ? "Type a message..."
              : "Type email content..."
          }
          rows={1}
          className="flex-1 resize-none px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-h-30"
        />

        <div className="flex items-center gap-1 pb-0.5">
          {/* Schedule button */}
          {canSchedule && (
            <Tooltip content={showSchedule ? "Cancel schedule" : "Schedule"}>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className={`p-2 rounded-full transition-colors ${
                  showSchedule
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <CalendarClock className="w-5 h-5" />
              </button>
            </Tooltip>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!body.trim() || !currentContact || sending}
            className={`p-2 rounded-full transition-colors ${
              body.trim() && currentContact && !sending
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComposeBar;
