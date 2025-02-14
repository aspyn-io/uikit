import { Meta, StoryObj } from "@storybook/react";
import NoteCard from "../components/NoteCard";

const meta: Meta<typeof NoteCard> = {
  title: "Cards/NoteCard",
  component: NoteCard,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof NoteCard>;

export const Default: Story = {
  args: {
    tags: [
      { label: "React", color: "blue" },
      { label: "UI", color: "green" },
    ],
    title: "Introduction to React",
    content: "React is a JavaScript library for building user interfaces...",
    author: "John Doe",
    time: "2 hours ago",
    avatar: "https://i.pravatar.cc/300",
  },
};

export const WithLongContent: Story = {
  args: {
    tags: [
      { label: "JavaScript", color: "yellow" },
      { label: "Programming", color: "red" },
    ],
    title: "Understanding JavaScript Closures",
    content:
      "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function’s scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time...",
    author: "Jane Smith",
    time: "1 day ago",
    avatar: "https://i.pravatar.cc/300",
  },
};

export const WithMultipleTags: Story = {
  args: {
    tags: [
      { label: "HTML", color: "orange" },
      { label: "CSS", color: "purple" },
      { label: "JavaScript", color: "yellow" },
      { label: "Web Development", color: "blue" },
    ],
    title: "Building a Responsive Website",
    content:
      "Responsive web design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes...",
    author: "Alice Johnson",
    time: "3 days ago",
    avatar: "https://i.pravatar.cc/300",
  },
};

export const WithoutTags: Story = {
  args: {
    tags: [],
    title: "No Tags Example",
    content: "This is an example of a NoteCard without any tags.",
    author: "Chris Doe",
    time: "5 hours ago",
    avatar: "https://i.pravatar.cc/300",
  },
};
