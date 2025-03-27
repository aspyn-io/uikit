import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HiOutlineCode } from 'react-icons/hi';
import JsonViewer from '../components/JsonViewer';

const meta: Meta<typeof JsonViewer> = {
  title: 'Components/JsonViewer',
  component: JsonViewer,
  tags: ['autodocs'],
  argTypes: {
    buttonLabel: {
      control: 'text',
      description: 'Text to display on the button',
    },
    title: {
      control: 'text',
      description: 'Title for the modal (required)',
      required: true,
    },
    data: {
      control: 'object',
      description: 'JSON data to display',
    },
    buttonProps: {
      control: 'object',
      description: 'Props to pass to the button component',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the modal can be dismissed by clicking outside or pressing ESC',
      defaultValue: true,
    },
    invalidDataMessage: {
      control: 'text',
      description: 'Custom message to display when data cannot be stringified',
    },
    allowCopy: {
      control: 'boolean',
      description: 'Whether to show the copy button',
      defaultValue: true,
    },
    isOpen: {
      control: 'boolean',
      description: 'Optional controlled state for the modal. If not provided, the component manages its own state.',
    },
    onOpenChange: {
      description: 'Optional callback fired when the modal open state changes. Required if isOpen is provided.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JsonViewer>;

const sampleData = {
  id: '123',
  name: 'Sample Data',
  items: [
    { id: 1, value: 'test1' },
    { id: 2, value: 'test2' },
  ],
};

// Template component to handle state
const JsonViewerTemplate: React.FC<{ args: any }> = ({ args }) => {
  return (
    <div className="p-4">
      <JsonViewer {...args} />
    </div>
  );
};

// Add a template for controlled behavior demonstration
const ControlledJsonViewerTemplate: React.FC<{ args: any }> = ({ args }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <JsonViewer {...args} isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <JsonViewerTemplate args={args} />,
  args: {
    data: sampleData,
    title: 'Sample Data Viewer',
    buttonLabel: 'View JSON',
  },
};

export const ControlledState: Story = {
  render: (args) => <ControlledJsonViewerTemplate args={args} />,
  args: {
    data: sampleData,
    title: 'Controlled Modal Example',
    buttonLabel: 'Open Controlled Modal',
  },
};

export const WithIcon: Story = {
  render: (args) => <JsonViewerTemplate args={args} />,
  args: {
    data: sampleData,
    title: 'Sample Data Viewer',
    buttonLabel: <HiOutlineCode className="w-4 h-4" />,
    buttonProps: {
      color: 'gray',
      size: 'sm',
    },
  },
};

export const CustomButton: Story = {
  render: (args) => <JsonViewerTemplate args={args} />,
  args: {
    data: sampleData,
    title: 'Sample Data Viewer',
    buttonProps: {
      color: 'purple',
      size: 'xl',
      outline: true,
    },
    buttonLabel: 'View Raw Data',
  },
};

const circularObject: any = {
  name: 'Circular Reference',
};
circularObject.self = circularObject;

export const NonDismissibleModal: Story = {
  render: (args) => <JsonViewerTemplate args={args} />,
  args: {
    data: sampleData,
    title: 'Non-dismissible Modal',
    buttonLabel: 'Open Non-dismissible Modal',
    buttonProps: {
      color: 'warning',
    },
    dismissible: false,
  },
};

export const InvalidData: Story = {
  render: (args) => <JsonViewerTemplate args={args} />,
  args: {
    data: circularObject,
    title: 'Invalid Data Modal',
    buttonLabel: 'View Invalid Data',
    buttonProps: {
      color: 'failure',
    },
    invalidDataMessage: 'This data cannot be displayed due to circular references',
  },
};

export const WithoutCopyButton: Story = {
  render: (args) => <JsonViewerTemplate args={args} />,
  args: {
    data: sampleData,
    title: 'View Without Copy Button',
    buttonLabel: 'View JSON',
    allowCopy: false,
  },
};