import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./Checkbox";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    error: {
      control: "boolean",
      description: "Exibe estado de erro",
    },
    disabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    description: {
      control: "text",
    },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Stories básicas mantidas

export const ErrorState: Story = {
  args: {
    label: "Checkbox",
    error: false,
  },
};

export const ErrorStateChecked: Story = {
  args: {
    label: "Checkbox com erro marcado",
    error: true,
    checked: true,
  },
};

export const ErrorStateWithDescription: Story = {
  args: {
    label: "Checkbox com erro",
    description: "Descrição explicando o erro",
    error: true,
  },
};

export const ErrorStateDisabled: Story = {
  args: {
    label: "Checkbox com erro desabilitado",
    error: true,
    disabled: true,
  },
};

const ErrorInteractiveComponent = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [hasError, setHasError] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="Checkbox com erro interativo"
        error={hasError}
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />

      <div className="flex items-center gap-2 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasError}
            onChange={(e) => setHasError(e.target.checked)}
            className="w-4 h-4"
          />
          Estado de erro
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-4 h-4"
          />
          Marcado
        </label>
      </div>

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-medium mb-2">Estado atual:</h3>
        <ul className="text-sm">
          <li>Erro: {hasError ? "Sim" : "Não"}</li>
          <li>Marcado: {isChecked ? "Sim" : "Não"}</li>
        </ul>
      </div>
    </div>
  );
};

export const ErrorInteractive: Story = {
  render: () => <ErrorInteractiveComponent />,
};

export const ErrorStateGallery: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4">
      <Checkbox label="Erro não marcado" error />
      <Checkbox label="Erro marcado" error checked />
      <Checkbox label="Erro desabilitado" error disabled />
      <Checkbox label="Erro marcado e desabilitado" error checked disabled />
      <Checkbox
        label="Erro com descrição"
        error
        description="Este é um exemplo de descrição de erro"
      />
    </div>
  ),
};
