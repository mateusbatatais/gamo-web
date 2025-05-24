import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Input, InputProps } from './Input';

const meta: Meta<InputProps> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<InputProps>;

export const Default: Story = {
  args: {
    label: 'Nome',
    placeholder: 'Digite seu nome',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'user@example.com',
    error: 'Email inválido',
  },
};
