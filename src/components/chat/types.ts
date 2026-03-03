/**
 * ChatView component type definitions.
 *
 * These types are intentionally decoupled from any specific SDK or backend
 * so that the ChatView can be reused across different consumers.
 */

/** The communication channel */
export type ChatChannel = "message" | "email";

/** The direction of the communication */
export type ChatDirection = "inbound" | "outbound";

/** Status of a sent communication */
export type ChatMessageStatus =
  | "sent"
  | "delivered"
  | "failed"
  | "skipped"
  | "processing"
  | "noop";

/** Who sent or scheduled the communication */
export interface ChatSender {
  /** Unique identifier for the sender */
  id?: string;
  /** Display name (e.g. "John Doe" or "System") */
  name: string;
  /** Whether this is an automated/system message */
  isSystem?: boolean;
  /** Avatar URL */
  avatarUrl?: string;
}

/** A single communication item in the chat */
export interface ChatItem {
  /** Unique identifier */
  id: string;
  /** Channel type (message or email) */
  channel: ChatChannel;
  /** Direction of the communication */
  direction: ChatDirection;
  /** The contact endpoint - phone number or email address */
  contact: string;
  /** Message preview or body text */
  body: string;
  /** For emails: the subject line */
  subject?: string;
  /** Template name if sent via template */
  templateName?: string;
  /** ISO timestamp of when this was created/sent */
  timestamp: string;
  /** Status of the communication */
  status: ChatMessageStatus;
  /** Who sent or triggered this communication */
  sender?: ChatSender;
  /** Whether this is a queued/scheduled communication */
  isQueued?: boolean;
  /** ISO timestamp of when a queued message is scheduled to be sent */
  scheduledAt?: string;
  /** Number of sending attempts (for queued items) */
  attempts?: number;
  /** Last error message if failed */
  errorMessage?: string;
  /** Whether the message has attachments */
  hasAttachments?: boolean;
  /** Number of attachments */
  attachmentCount?: number;
  /** Communication type (transactional, marketing, inbound, etc.) */
  communicationType?: string;
  /** Arbitrary metadata consumers can attach for click handlers */
  meta?: Record<string, unknown>;
}

/** Dates that have communications (for calendar navigation) */
export interface ChatDateMarker {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Total number of communications on that date */
  count: number;
}

/** Permissions/mode configuration */
export interface ChatPermissions {
  /** Whether the user can send messages */
  canSendMessage?: boolean;
  /** Whether the user can send emails */
  canSendEmail?: boolean;
  /** Whether the user can schedule messages */
  canScheduleMessage?: boolean;
  /** Whether the user can schedule emails */
  canScheduleEmail?: boolean;
  /** Whether the user can cancel/delete queued items */
  canCancelQueued?: boolean;
  /** Whether the user can resend failed items */
  canResend?: boolean;
}

/** Message compose payload */
export interface ChatComposePayload {
  /** Channel to send through */
  channel: ChatChannel;
  /** Recipient address (phone or email) */
  to: string;
  /** Message body (for messages) or content (for emails) */
  body: string;
  /** Email subject (only for emails) */
  subject?: string;
  /** Whether to schedule it */
  schedule?: boolean;
  /** ISO timestamp for scheduled send */
  scheduledAt?: string;
}

/** Callback signatures for the ChatView */
export interface ChatCallbacks {
  /** Called when loading more (older) messages, returns items to prepend */
  onLoadMore: () => Promise<ChatItem[]>;
  /** Called when a chat item is clicked for details */
  onItemClick?: (item: ChatItem) => void;
  /** Called when the user sends a new message */
  onSend?: (payload: ChatComposePayload) => Promise<void>;
  /** Called when the user wants to cancel a queued item */
  onCancelQueued?: (item: ChatItem) => Promise<void>;
  /** Called when the user wants to send a queued item now */
  onSendQueuedNow?: (item: ChatItem) => Promise<void>;
  /** Called when the user wants to resend a failed item */
  onResend?: (item: ChatItem) => Promise<void>;
  /** Called to fetch dates that have communications (for calendar) */
  onFetchDates?: (month: Date) => Promise<ChatDateMarker[]>;
  /** Called when user navigates to a specific date via calendar */
  onNavigateToDate?: (date: Date) => Promise<ChatItem[]>;
  /** Called when a day separator label is clicked (e.g., to show calendar) */
  onDayLabelClick?: (date: Date) => void;
}

/** Props for the main ChatView component */
export interface ChatViewProps {
  /** Array of chat items to display */
  items: ChatItem[];
  /** Whether more (older) items are available to load */
  hasMore: boolean;
  /** Whether items are currently loading */
  loading?: boolean;
  /** Whether a refresh is in progress */
  refreshing?: boolean;
  /** Available contacts for sending (phone numbers and emails) */
  contacts?: {
    phoneNumbers: string[];
    emails: string[];
  };
  /** Permissions configuration */
  permissions?: ChatPermissions;
  /** User's timezone (IANA format, e.g. "America/New_York") */
  timezone?: string;
  /** All callbacks */
  callbacks: ChatCallbacks;
  /** Optional class name for the root container */
  className?: string;
  /** Optional empty state message */
  emptyMessage?: string;
  /** Optional header content to render above the chat */
  headerContent?: React.ReactNode;
  /** Custom date picker renderer for the compose bar schedule input */
  renderDatePicker?: (props: {
    value: string;
    onChange: (value: string) => void;
    minDate?: Date;
  }) => React.ReactNode;
}
