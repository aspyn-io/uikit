import { Meta, StoryObj } from '@storybook/react';
import { MyModal } from '../components/MyModal';

const meta: Meta<typeof MyModal> = {
  title: 'Example/MyModal',
  component: MyModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MyModal>;

export const Default: Story = {
  args: {
    title: 'MyModal Title',
    message: 'This is an alert box text inside the MyModal.',
    buttonText: 'Open MyModal',
  },
};
