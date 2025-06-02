import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import Modal from "../components/Modal";

import { Button, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

// Meta configuration for the Modal component
const meta: Meta<typeof Modal> = {
  title: "components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    show: false,
    size: "md", // Default size
    children: "This is the content of the modal.",
  },
  argTypes: {
    show: {
      control: "boolean",
      description: "Controls whether the modal is visible.",
    },
    size: {
      control: {
        type: "select",
        options: [
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4xl",
          "5xl",
          "6xl",
          "7xl",
        ],
      },
      description: "The size of the modal.",
    },
    onClose: {
      action: "closed",
      description: "Callback when the modal is closed.",
    },
    children: {
      control: "text",
      description: "The content inside the modal.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Default Template
const ModalTemplate: React.FC<{ args: any }> = ({ args }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)}>Open Modal</Button>
      <Modal
        {...args}
        show={show}
        onClose={() => {
          setShow(false);
          args.onClose?.();
        }}
      >
        <Modal.Header>{args.title || "Default Title"}</Modal.Header>
        <Modal.Body>{args.children}</Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button onClick={() => alert("Confirmed!")}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// Default Story
export const Default: Story = {
  render: (args) => (
    <Modal {...args}>
      <Modal.Header>{args.title || "Default Title"}</Modal.Header>
      <Modal.Body>{args.children}</Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={() => console.log("Action clicked")}>
          I accept
        </Button>
        <Button color="gray" onClick={() => console.log("Cancel clicked")}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  ),
  args: {
    title: "Example Modal Title",
    children: "This is an example of a modal using the default configuration.",
    size: "md",
  },
};

// Larger Modal
export const LargeModal: Story = {
  render: (args) => <ModalTemplate args={args} />,
  args: {
    title: "Large Modal",
    children: "This modal is larger than the default modal.",
    size: "lg",
  },
};

export const MassiveModal: Story = {
  render: (args) => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button onClick={() => setShow(true)}>Open Massive Modal</Button>
        <Modal {...args} show={show} onClose={() => setShow(false)}>
          <ModalHeader>{args.title || "Massive Modal"}</ModalHeader>
          <ModalBody>
            <p>
              This modal demonstrates the `4xl` size configuration. You can use
              it to display significant amounts of content without breaking the
              layout.
            </p>
            <p>
              Add any additional details here. The modal size should clearly
              indicate that the size prop is being respected and the modal is
              rendered as expected.
            </p>
            <p>
              Try resizing the window or interacting with the modal to test its
              behavior with click-outside and escape-key handling.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="gray" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button>Save</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
  args: {
    title: "Massive Modal Example",
    size: "4xl", // Explicitly set to the largest size
  },
};
