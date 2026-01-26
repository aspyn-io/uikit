import { Meta, StoryObj } from "@storybook/react";
import MetadataEditor from "../components/MetadataEditor";

const meta = {
  title: "Components/MetadataEditor",
  component: MetadataEditor,
  tags: ["autodocs"],
  argTypes: {
    importantFields: {
      control: "object",
      description:
        "Optional ordered list of keys to pin to the top (in the given order)",
    },
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
    showCopyValueButton: {
      control: "boolean",
      description: "Show copy button for individual values",
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
    showCopyValueButton: true,
    title: "Metadata",
  },
};

export const Loading: Story = {
  args: {
    metadata: null,
    isLoading: true,
    showEditButton: true,
    showCopyButton: true,
    showCopyValueButton: true,
    title: "Metadata",
  },
};

export const Empty: Story = {
  args: {
    metadata: undefined,
    isLoading: false,
    showEditButton: true,
    showCopyButton: true,
    showCopyValueButton: true,
    title: "Metadata",
  },
};

export const EmptyWithEditDisabled: Story = {
  args: {
    metadata: undefined,
    isLoading: false,
    showEditButton: false,
    showCopyButton: true,
    showCopyValueButton: true,
    title: "Metadata",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When metadata is empty and edit is disabled, users cannot add metadata.",
      },
    },
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
    showCopyValueButton: true,
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
    showCopyValueButton: true,
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
    showCopyValueButton: true,
    title: "Custom Properties",
  },
};

export const NoCopyValueButtons: Story = {
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
    showCopyValueButton: false,
    title: "Metadata",
  },
};

export const WithImportantFields: Story = {
  args: {
    metadata: {
      region: "US-West",
      priority: "high",
      source: "patch",
      version: "2.1.0",
      environment: "staging",
      account_id: "acc_2f8d3c1a",
      team: "Payments",
      active_users: "1247",
      auto_renew: "true",
    },
    importantFields: ["source", "environment", "account_id", "priority"],
    showEditButton: true,
    showCopyButton: true,
    showCopyValueButton: true,
    title: "Metadata",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pinned keys render first in the exact order provided, in both view mode and the edit modal.",
      },
    },
  },
};

export const WithImportantFieldsMissingKeys: Story = {
  args: {
    metadata: {
      region: "US-West",
      priority: "high",
      source: "patch",
      version: "2.1.0",
      environment: "staging",
    },
    importantFields: ["source", "environment", "account_id", "team"],
    showEditButton: true,
    showCopyButton: true,
    showCopyValueButton: true,
    title: "Metadata",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Missing important keys are ignored (only present keys get pinned).",
      },
    },
  },
};
