import { Meta, StoryObj } from "@storybook/react";
import MetadataEditor from "../components/MetadataEditor";

const meta = {
  title: "Components/MetadataEditor",
  component: MetadataEditor,
  tags: ["autodocs"],
  argTypes: {
    isLoading: {
      control: "boolean",
      description: "Show loading skeleton",
    },
    showEditButton: {
      control: "boolean",
      description: "Show edit button",
    },
    showCopyButton: {
      control: "boolean",
      description: "Show copy button",
    },
    title: {
      control: "text",
      description: "Section title",
    },
  },
} satisfies Meta<typeof MetadataEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metadata: {
      region: "US-West",
      priority: "high",
      version: "2.1.0",
      active_users: "1247",
      auto_renew: "true",
    },
    showEditButton: true,
    showCopyButton: true,
    title: "Metadata",
  },
};

export const Loading: Story = {
  args: {
    metadata: null,
    isLoading: true,
    showEditButton: true,
    showCopyButton: true,
    title: "Metadata",
  },
};

export const Empty: Story = {
  args: {
    metadata: undefined,
    isLoading: false,
    showEditButton: true,
    showCopyButton: true,
    title: "Metadata",
  },
};

export const ReadOnly: Story = {
  args: {
    metadata: {
      region: "US-West",
      priority: "high",
      version: "2.1.0",
      active_users: "1247",
      auto_renew: "true",
    },
    showEditButton: false,
    showCopyButton: true,
    title: "Metadata",
  },
};

export const WithLongValues: Story = {
  args: {
    metadata: {
      description:
        "This is a very long metadata value that demonstrates how the component handles text wrapping and display of extended content without breaking the layout.",
      configuration:
        "environment=production&region=us-west-2&timeout=30000&retry_count=3",
      webhook_url:
        "https://example.com/webhooks/very-long-webhook-url-that-extends-quite-far",
      small_value: "short",
    },
    showEditButton: true,
    showCopyButton: true,
    title: "Metadata",
  },
};

export const CustomTitle: Story = {
  args: {
    metadata: {
      region: "US-West",
      priority: "high",
      version: "2.1.0",
    },
    showEditButton: true,
    showCopyButton: true,
    title: "Custom Properties",
  },
};
