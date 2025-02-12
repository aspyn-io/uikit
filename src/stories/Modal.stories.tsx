import { Meta, StoryObj } from "@storybook/react";
import Modal from "../components/Modal";

const meta: Meta<typeof Modal> = {
  title: "Example/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    title: "Modal Title",
    message: "This is an alert box text inside the Modal.",
    buttonText: "Open Modal",
  },
};
