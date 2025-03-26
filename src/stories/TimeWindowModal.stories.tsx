import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import TimeWindowModal, { TimeWindow } from '../components/TimeWindowModal';
import { Button } from 'flowbite-react';

const meta: Meta<typeof TimeWindowModal> = {
  title: 'Modals/TimeWindowModal',
  component: TimeWindowModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'TimeWindowModal is a reusable modal component for selecting time windows, such as scheduling appointments or consultations. It features date range selection, a search functionality, and a grid of available time slots.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is open or closed',
    },
    title: {
      control: 'text',
      description: 'The title displayed at the top of the modal',
    },
    timeWindows: {
      control: 'object',
      description: 'Array of time window objects to display as selectable options',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function when the modal is closed',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Callback function when a time window is selected and confirmed',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback function when the search button is clicked with start and end dates',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimeWindowModal>;

// Sample data for time windows
const sampleTimeWindows: TimeWindow[] = [
  {
    window_start_at: new Date().toISOString(),
    window_end_at: new Date(new Date().getTime() + 3600000).toISOString(), // +1 hr
    total_slots: 5,
  },
  {
    window_start_at: new Date(new Date().getTime() + 7200000).toISOString(), // +2 hr
    window_end_at: new Date(new Date().getTime() + 10800000).toISOString(), // +3 hr
    total_slots: 3,
  },
];

// Template to manage modal state
const TimeWindowModalTemplate: React.FC<{ args: any }> = ({ args }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    args.onClose();
  };

  const handleSubmit = (timeWindow: TimeWindow, startDate: string, endDate: string) => {
    args.onSubmit(timeWindow, startDate, endDate);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <TimeWindowModal
        {...args}
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

// Default story
export const Default: Story = {
  render: (args) => <TimeWindowModalTemplate args={args} />,
  args: {
    title: 'Schedule Appointment',
    timeWindows: sampleTimeWindows,
    onClose: () => console.log('Modal closed'),
    onSubmit: (selectedTimeWindow: TimeWindow, startDate: string, endDate: string) =>
      console.log('Submitted:', selectedTimeWindow, startDate, endDate),
    onSearch: (startDate: string, endDate: string) =>
      console.log('Search for:', startDate, endDate),
  },
};

// Story with no time windows
export const WithNoTimeWindows: Story = {
  render: (args) => <TimeWindowModalTemplate args={args} />,
  args: {
    ...Default.args,
    timeWindows: [],
  },
};

// Story with a custom title
export const WithCustomTitle: Story = {
  render: (args) => <TimeWindowModalTemplate args={args} />,
  args: {
    ...Default.args,
    title: 'Book a Consultation',
  },
};