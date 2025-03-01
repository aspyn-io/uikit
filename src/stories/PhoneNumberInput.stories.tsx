import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import PhoneNumberInput from '../components/PhoneNumberInput';

const meta: Meta<typeof PhoneNumberInput> = {
  title: 'Forms/PhoneNumberInput',
  component: PhoneNumberInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PhoneNumberInput>;

const countries = [
  { code: '+1', label: 'United States', flag: '🇺🇸' },
  { code: '+44', label: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', label: 'Australia', flag: '🇦🇺' },
  { code: '+49', label: 'Germany', flag: '🇩🇪' },
  { code: '+33', label: 'France', flag: '🇫🇷' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <PhoneNumberInput {...args} value={value} onChange={setValue} />;
  },
  args: {
    placeholder: 'Enter phone number',
    countries,
  },
};
