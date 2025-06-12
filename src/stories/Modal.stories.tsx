import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import Modal from "../components/Modal";

import { Button } from "flowbite-react";

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
    dismissible: {
      control: "boolean",
      description: "Whether the modal can be dismissed by clicking outside or pressing escape.",
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
  render: (args) => {
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
            <Button color="blue" onClick={() => setShow(false)}>
              I accept
            </Button>
            <Button color="gray" onClick={() => setShow(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
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
          <Modal.Header>{args.title || "Massive Modal"}</Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button>Save</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  args: {
    title: "Massive Modal Example",
    size: "4xl", // Explicitly set to the largest size
  },
};

// Non-dismissible Modal Story
export const NonDismissible: Story = {
  render: (args) => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button onClick={() => setShow(true)}>Open Non-Dismissible Modal</Button>
        <Modal {...args} show={show} onClose={() => setShow(false)}>
          <Modal.Header>Non-Dismissible Modal</Modal.Header>
          <Modal.Body>
            <p>
              This modal cannot be dismissed by clicking outside or pressing escape. 
              You must use the buttons to close it.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShow(false)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  args: {
    dismissible: false,
    size: "md",
  },
};

// Scrollable Content Modal Story
export const ScrollableContent: Story = {
  render: (args) => {
    const [show, setShow] = useState(false);

    return (
      <>
        <Button onClick={() => setShow(true)}>Open Scrollable Modal</Button>
        <Modal {...args} show={show} onClose={() => setShow(false)}>
          <Modal.Header>Scrollable Content Modal</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              {Array.from({ length: 50 }, (_, i) => (
                <p key={i}>
                  This is paragraph number {i + 1}. This modal demonstrates scrollable content 
                  when the content exceeds the maximum height of 90vh. The modal body should 
                  become scrollable while keeping the header and footer visible.
                </p>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button onClick={() => setShow(false)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },
  args: {
    size: "lg",
  },
};
