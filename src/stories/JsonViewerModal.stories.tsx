import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import JsonViewerModal from '../components/JsonViewerModal';
import { Button } from 'flowbite-react';

const meta: Meta<typeof JsonViewerModal> = {
  title: 'Modals/JsonViewerModal',
  component: JsonViewerModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'JsonViewerModal is a reusable modal component for displaying JSON data in a formatted view. It provides a clean interface for inspecting data structures.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    show: {
      control: 'boolean',
      description: 'Controls whether the modal is open or closed',
    },
    title: {
      control: 'text',
      description: 'The title displayed at the top of the modal',
    },
    data: {
      control: 'object',
      description: 'The data to be displayed in JSON format',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function when the modal is closed',
    },
    invalidDataMessage: {
      control: 'text',
      description: 'Custom message to display when JSON data cannot be stringified',
      defaultValue: 'Unable to display data: Invalid or circular JSON structure',
    },
    allowCopy: {
      control: 'boolean',
      description: 'Whether to show the copy button',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof JsonViewerModal>;

const sampleData = {
  id: '123',
  name: 'Sample Work Order',
  status: 'PENDING',
  items: [
    { id: 1, description: 'Task 1' },
    { id: 2, description: 'Task 2' },
  ],
};

const JsonViewerModalTemplate: React.FC<{ args: any }> = ({ args }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setShow(true)}>View JSON Data</Button>
      <JsonViewerModal
        {...args}
        show={show}
        onClose={() => setShow(false)}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <JsonViewerModalTemplate args={args} />,
  args: {
    title: 'Work Order Data',
    data: sampleData,
  },
};

export const LargeDataset: Story = {
  render: (args) => <JsonViewerModalTemplate args={args} />,
  args: {
    title: 'Large Dataset',
    data: Array(100).fill(sampleData),
  },
};

const circularObject: any = {
  name: 'Circular Reference',
};
circularObject.self = circularObject;

export const CustomMessageForInvalidData: Story = {
  render: (args) => <JsonViewerModalTemplate args={args} />,
  args: {
    title: 'Invalid JSON Data',
    data: circularObject,
    invalidDataMessage: 'Custom error message for invalid data',
  },
};

export const InvalidJsonData: Story = {
  render: (args) => <JsonViewerModalTemplate args={args} />,
  args: {
    title: 'Custom Error Message',
    data: circularObject,
  },
};

export const WithoutCopyButton: Story = {
  render: (args) => <JsonViewerModalTemplate args={args} />,
  args: {
    title: 'Modal Without Copy Button',
    data: sampleData,
    allowCopy: false,
  },
};
