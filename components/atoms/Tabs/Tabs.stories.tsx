// components/atoms/Tabs/Tabs.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabItem } from "./Tabs";
import { CheckCircle, Star } from "lucide-react";
import React from "react";

const meta: Meta<typeof Tabs> = {
  title: "Atoms/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    fullWidth: { control: "boolean" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const Template: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem label="Perfil">
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">Informações do Perfil</h3>
          <p>Conteúdo da aba de perfil...</p>
        </div>
      </TabItem>
      <TabItem label="Configurações">
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">Configurações da Conta</h3>
          <p>Conteúdo da aba de configurações...</p>
        </div>
      </TabItem>
      <TabItem label="Privacidade">
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-2">Configurações de Privacidade</h3>
          <p>Conteúdo da aba de privacidade...</p>
        </div>
      </TabItem>
    </Tabs>
  ),
};

export const Default = {
  ...Template,
};

export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem label="Perfil" icon={<Star size={16} />}>
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">Conteúdo com ícone</div>
      </TabItem>
      <TabItem label="Configurações" icon={<CheckCircle size={16} />}>
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">Conteúdo com ícone</div>
      </TabItem>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem label="Ativa">
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">Aba ativa</div>
      </TabItem>
      <TabItem label="Desabilitada" disabled>
        <div className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">
          Esta aba está desabilitada
        </div>
      </TabItem>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  ...Template,
  args: {
    fullWidth: true,
  },
};

export const CustomStyles: Story = {
  render: (args) => (
    <Tabs
      className="border border-neutral-200 dark:border-gray-700 rounded-lg p-4"
      tabListClassName="gap-1"
      tabClassName="rounded-t-lg px-3 py-2"
      activeTabClassName="text-primary-700 border-primary-500 dark:text-primary-300"
      inactiveTabClassName="hover:text-neutral-900 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600"
      contentClassName="pt-4"
      {...args}
    >
      <TabItem label="Estilizada">
        <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          Aba com estilos customizados
        </div>
      </TabItem>
      <TabItem label="Personalizada">
        <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          Conteúdo personalizado
        </div>
      </TabItem>
    </Tabs>
  ),
};
