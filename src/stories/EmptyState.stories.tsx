import { Meta, StoryObj } from "@storybook/react";
import EmptyState from "../components/EmptyState";
import {
  HiDatabase,
  HiUpload,
  HiInbox,
  HiSearch,
  HiDocumentAdd,
  HiPhotograph,
  HiFolderOpen,
  HiCube,
  HiBell,
} from "react-icons/hi";

const meta: Meta<typeof EmptyState> = {
  title: "Cards/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// Default centered empty state
export const Default: Story = {
  args: {
    title: "No messages",
    description:
      "You don't have any messages in your inbox yet. When you do, they'll show up here.",
    icon: <HiInbox size={32} />,
    buttonText: "Compose message",
    onButtonClick: () => console.log("Compose clicked"),
  },
};

// Interactive dashed button style
export const DashedButton: Story = {
  args: {
    layout: "dashed",
    title: "Create a new database",
    icon: <HiDatabase size={48} />,
    asButton: true,
    onClick: () => console.log("Create database clicked"),
    size: "sm",
  },
};

// Upload zone with dashed border
export const DashedUploadZone: Story = {
  args: {
    layout: "dashed",
    title: "Upload files",
    description: "or drag and drop them here",
    icon: <HiUpload size={48} />,
    asButton: true,
    onClick: () => console.log("Upload zone clicked"),
    size: "sm",
  },
};

// Left-aligned with secondary action
export const LeftAligned: Story = {
  args: {
    layout: "left",
    title: "No search results",
    description:
      "We couldn't find any results for your search. Try adjusting your keywords or filters.",
    icon: <HiSearch size={32} />,
    buttonText: "Clear filters",
    onButtonClick: () => console.log("Clear filters clicked"),
    secondaryButtonText: "New search",
    onSecondaryButtonClick: () => console.log("New search clicked"),
  },
};

// Card layout in small size
export const CardLayout: Story = {
  args: {
    layout: "card",
    size: "sm",
    title: "No files uploaded",
    description: "Drop your files here or click to upload",
    icon: <HiDocumentAdd size={24} />,
    buttonText: "Upload files",
    onButtonClick: () => console.log("Upload clicked"),
  },
};

// Large size with illustration
export const WithIllustration: Story = {
  args: {
    size: "lg",
    title: "Your gallery is empty",
    description: "Add some images to your gallery to see them displayed here",
    illustration: (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
        <HiPhotograph size={64} className="text-gray-400 dark:text-gray-500" />
      </div>
    ),
    buttonText: "Add images",
    onButtonClick: () => console.log("Add images clicked"),
  },
};

// Custom styling example
export const CustomStyling: Story = {
  args: {
    title: "No projects yet",
    description: "Create your first project to get started",
    icon: <HiFolderOpen size={32} />,
    buttonText: "Create project",
    onButtonClick: () => console.log("Create project clicked"),
    className: "bg-blue-50 dark:bg-blue-900",
    iconClassName: "text-blue-500 dark:text-blue-400",
    titleClassName: "text-blue-900 dark:text-blue-100",
    descriptionClassName: "text-blue-700 dark:text-blue-300",
  },
};

// Fullscreen layout
export const Fullscreen: Story = {
  args: {
    layout: "fullscreen",
    title: "Welcome to the app",
    description: "Get started by creating your first item",
    icon: <HiCube size={48} />,
    buttonText: "Create item",
    onButtonClick: () => console.log("Create item clicked"),
    className: "bg-gray-50 dark:bg-gray-900",
  },
  parameters: {
    layout: "fullscreen",
  },
};

// Without buttons
export const WithoutButtons: Story = {
  args: {
    title: "No notifications",
    description: "When you receive notifications, they will appear here.",
    icon: <HiBell size={32} />,
  },
};

// Without icon
export const WithoutIcon: Story = {
  args: {
    title: "No results found",
    description: "Try adjusting your search filters or try a different query.",
    buttonText: "Clear filters",
    onButtonClick: () => console.log("Clear filters clicked"),
  },
};

// Title only
export const TitleOnly: Story = {
  args: {
    title: "No data available",
  },
};
