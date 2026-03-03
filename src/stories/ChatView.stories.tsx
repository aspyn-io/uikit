import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatView } from "../components/chat/ChatView";
import type { ChatItem, ChatViewProps } from "../components/chat/types";

/* eslint-disable @typescript-eslint/no-unused-vars */
const noopAsync = async (..._args: unknown[]) => {};
const noopLoadMore = async () => [] as ChatItem[];
const noopSend = async () => {};
const noopItem = async (_item: ChatItem) => {};
const noopDate = async (_date: Date) => [] as ChatItem[];

// --- Mock data generators ---

const now = new Date();
const daysAgo = (days: number, hours = 12, minutes = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const mockItems: ChatItem[] = [
  // 3 days ago
  {
    id: "1",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Hi! Your appointment is confirmed for tomorrow at 2 PM. We look forward to seeing you!",
    timestamp: daysAgo(3, 9, 0),
    status: "delivered",
    sender: { name: "System", isSystem: true },
    communicationType: "transactional",
  },
  {
    id: "2",
    channel: "message",
    direction: "inbound",
    contact: "+11234567890",
    body: "Great, thank you! Can I get a reminder in the morning?",
    timestamp: daysAgo(3, 9, 15),
    status: "delivered",
  },
  {
    id: "3",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Absolutely! We'll send you a reminder tomorrow morning at 8 AM.",
    timestamp: daysAgo(3, 9, 20),
    status: "sent",
    sender: { name: "Sarah Johnson" },
  },
  // 2 days ago
  {
    id: "4",
    channel: "email",
    direction: "outbound",
    contact: "customer@example.com",
    subject: "Appointment Reminder",
    body: "This is a friendly reminder about your appointment today at 2 PM.",
    templateName: "appointment-reminder",
    timestamp: daysAgo(2, 8, 0),
    status: "delivered",
    sender: { name: "System", isSystem: true },
    communicationType: "transactional",
    hasAttachments: true,
    attachmentCount: 1,
  },
  {
    id: "5",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Good morning! Just a reminder about your appointment today at 2 PM. Please arrive 10 minutes early.",
    timestamp: daysAgo(2, 8, 0),
    status: "delivered",
    sender: { name: "System", isSystem: true },
    communicationType: "transactional",
  },
  {
    id: "6",
    channel: "message",
    direction: "inbound",
    contact: "+11234567890",
    body: "Thanks for the reminder! I'll be there.",
    timestamp: daysAgo(2, 8, 30),
    status: "delivered",
  },
  // Yesterday
  {
    id: "7",
    channel: "email",
    direction: "outbound",
    contact: "customer@example.com",
    subject: "Service Summary",
    body: "Here's a summary of the service we provided yesterday. Thank you for choosing us!",
    templateName: "service-summary",
    timestamp: daysAgo(1, 14, 0),
    status: "sent",
    sender: { name: "System", isSystem: true },
    communicationType: "transactional",
    hasAttachments: true,
    attachmentCount: 2,
  },
  {
    id: "8",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Thank you for your visit yesterday! We hope you were happy with the service. Please let us know if you have any questions.",
    timestamp: daysAgo(1, 15, 0),
    status: "sent",
    sender: { name: "Mike Thompson" },
  },
  {
    id: "9",
    channel: "message",
    direction: "inbound",
    contact: "+11234567890",
    body: "Everything was great! The team did an excellent job. I'll definitely recommend you to my neighbors.",
    timestamp: daysAgo(1, 16, 30),
    status: "delivered",
  },
  // Today
  {
    id: "10",
    channel: "email",
    direction: "outbound",
    contact: "customer@example.com",
    subject: "Invoice #1234",
    body: "Your invoice for the recent service is attached. Payment is due within 30 days.",
    timestamp: daysAgo(0, 10, 0),
    status: "sent",
    sender: { name: "Billing System", isSystem: true },
    communicationType: "transactional",
    hasAttachments: true,
    attachmentCount: 1,
  },
  {
    id: "11",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Hi! We just sent your invoice to customer@example.com. Let us know if you have any questions about the charges.",
    timestamp: daysAgo(0, 10, 5),
    status: "sent",
    sender: { name: "Sarah Johnson" },
  },
];

const queuedItems: ChatItem[] = [
  {
    id: "q1",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Your next service appointment is coming up! We'll be there on Monday between 8 AM and 12 PM.",
    timestamp: daysAgo(0, 11, 0),
    status: "processing",
    isQueued: true,
    scheduledAt: daysAgo(-2, 8, 0), // 2 days from now
    sender: { name: "System", isSystem: true },
    communicationType: "transactional",
  },
  {
    id: "q2",
    channel: "email",
    direction: "outbound",
    contact: "customer@example.com",
    subject: "Upcoming Service Visit",
    body: "We're writing to confirm your upcoming service appointment...",
    templateName: "upcoming-service",
    timestamp: daysAgo(0, 11, 0),
    status: "processing",
    isQueued: true,
    scheduledAt: daysAgo(-2, 8, 0),
    sender: { name: "System", isSystem: true },
    communicationType: "transactional",
  },
];

const failedItems: ChatItem[] = [
  {
    id: "f1",
    channel: "message",
    direction: "outbound",
    contact: "+11234567890",
    body: "Your payment has been processed successfully!",
    timestamp: daysAgo(0, 9, 0),
    status: "failed",
    sender: { name: "System", isSystem: true },
    errorMessage: "Carrier rejected: Number is not reachable",
    communicationType: "transactional",
  },
];

const dateMarkers = [
  { date: daysAgo(3).split("T")[0], count: 3 },
  { date: daysAgo(2).split("T")[0], count: 3 },
  { date: daysAgo(1).split("T")[0], count: 3 },
  { date: daysAgo(0).split("T")[0], count: 4 },
];

// --- Story config ---

const meta: Meta<typeof ChatView> = {
  title: "Chat/ChatView",
  component: ChatView,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    className: "border border-gray-200 dark:border-gray-700 rounded-lg",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatView>;

// --- Stories ---

export const Default: Story = {
  args: {
    items: [...mockItems, ...queuedItems],
    hasMore: true,
    loading: false,
    contacts: {
      phoneNumbers: ["+11234567890", "+10987654321"],
      emails: ["customer@example.com", "other@example.com"],
    },
    permissions: {
      canSendMessage: true,
      canSendEmail: true,
      canScheduleMessage: true,
      canScheduleEmail: true,
      canCancelQueued: true,
      canResend: true,
    },
    timezone: "America/New_York",
    callbacks: {
      onLoadMore: noopLoadMore,
      onItemClick: () => {},
      onSend: noopSend,
      onCancelQueued: noopItem,
      onSendQueuedNow: noopItem,
      onResend: noopItem,
      onFetchDates: async () => dateMarkers,
      onNavigateToDate: noopDate,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Chat with John Doe
      </h3>
    ),
  },
};

export const ReadOnly: Story = {
  args: {
    items: mockItems,
    hasMore: false,
    loading: false,
    permissions: {
      canSendMessage: false,
      canSendEmail: false,
    },
    timezone: "America/New_York",
    callbacks: {
      onLoadMore: noopLoadMore,
      onItemClick: () => {},
      onFetchDates: async () => dateMarkers,
      onNavigateToDate: noopDate,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Communication History
      </h3>
    ),
  },
};

export const WithFailedMessages: Story = {
  args: {
    items: [...mockItems.slice(0, 5), ...failedItems, ...mockItems.slice(5)],
    hasMore: false,
    loading: false,
    contacts: {
      phoneNumbers: ["+11234567890"],
      emails: ["customer@example.com"],
    },
    permissions: {
      canSendMessage: true,
      canResend: true,
    },
    timezone: "America/New_York",
    callbacks: {
      onLoadMore: noopLoadMore,
      onItemClick: () => {},
      onSend: noopSend,
      onResend: noopItem,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Chat with Failed Messages
      </h3>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    items: [],
    hasMore: false,
    loading: false,
    contacts: {
      phoneNumbers: ["+11234567890"],
      emails: ["customer@example.com"],
    },
    permissions: {
      canSendMessage: true,
      canSendEmail: true,
    },
    callbacks: {
      onLoadMore: noopLoadMore,
      onSend: noopSend,
    },
    emptyMessage: "Start a conversation with this customer",
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        New Conversation
      </h3>
    ),
  },
};

export const Loading: Story = {
  args: {
    items: [],
    hasMore: false,
    loading: true,
    callbacks: {
      onLoadMore: noopLoadMore,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Loading...
      </h3>
    ),
  },
};

export const MessagesOnly: Story = {
  args: {
    items: mockItems.filter((i) => i.channel === "message"),
    hasMore: true,
    loading: false,
    contacts: {
      phoneNumbers: ["+11234567890"],
      emails: [],
    },
    permissions: {
      canSendMessage: true,
      canScheduleMessage: true,
    },
    timezone: "America/New_York",
    callbacks: {
      onLoadMore: noopLoadMore,
      onItemClick: () => {},
      onSend: noopSend,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        SMS Conversation
      </h3>
    ),
  },
};

export const QueuedOnly: Story = {
  args: {
    items: queuedItems,
    hasMore: false,
    loading: false,
    contacts: {
      phoneNumbers: ["+11234567890"],
      emails: ["customer@example.com"],
    },
    permissions: {
      canSendMessage: true,
      canSendEmail: true,
      canCancelQueued: true,
    },
    timezone: "America/New_York",
    callbacks: {
      onLoadMore: noopLoadMore,
      onItemClick: () => {},
      onCancelQueued: noopItem,
      onSendQueuedNow: noopItem,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Scheduled Messages
      </h3>
    ),
  },
};

export const MultipleContacts: Story = {
  args: {
    items: [
      ...mockItems,
      {
        id: "mc1",
        channel: "message",
        direction: "outbound",
        contact: "+10987654321",
        body: "This was sent to the secondary phone number.",
        timestamp: daysAgo(0, 11, 0),
        status: "sent",
        sender: { name: "Sarah Johnson" },
      },
      {
        id: "mc2",
        channel: "email",
        direction: "outbound",
        contact: "other@example.com",
        subject: "Follow-up",
        body: "This was sent to the secondary email.",
        timestamp: daysAgo(0, 11, 30),
        status: "sent",
        sender: { name: "Mike Thompson" },
      },
    ],
    hasMore: false,
    loading: false,
    contacts: {
      phoneNumbers: ["+11234567890", "+10987654321"],
      emails: ["customer@example.com", "other@example.com"],
    },
    permissions: {
      canSendMessage: true,
      canSendEmail: true,
      canScheduleMessage: true,
      canScheduleEmail: true,
    },
    timezone: "America/New_York",
    callbacks: {
      onLoadMore: noopLoadMore,
      onItemClick: () => {},
      onSend: noopSend,
    },
    headerContent: (
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Multiple Contact Methods
      </h3>
    ),
  },
};
