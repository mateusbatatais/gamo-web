import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './Button';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Default: Story = {
  args: {
    label: 'Clique aqui',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Não clicável',
    disabled: true,
  },
};
