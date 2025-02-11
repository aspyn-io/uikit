import type { Meta, StoryObj } from '@storybook/react';
import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
        height: '700px',
      },
    },
    story: {
      height: '150px',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
