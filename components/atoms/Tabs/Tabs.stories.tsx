// components/atoms/Tabs/Tabs.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabItem } from "./Tabs";
import { Button } from "../Button/Button";
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
      activeTabClassName="bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300"
      inactiveTabClassName="hover:bg-neutral-100 dark:hover:bg-gray-700"
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

export const ComplexContent: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabItem label="Formulário">
        <div className="space-y-4 p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label htmlFor="name" className="block mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Nome"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              aria-label="Email"
            />
          </div>
          <Button label="Enviar" variant="primary" />
        </div>
      </TabItem>
      <TabItem label="Lista">
        <ul className="p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg space-y-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <li key={item} className="p-2 border-b">
              Item {item}
            </li>
          ))}
        </ul>
      </TabItem>
    </Tabs>
  ),
};
