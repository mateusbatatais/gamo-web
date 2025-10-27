// components/atoms/InputPhone/InputPhone.stories.tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputPhone, type CountryCode } from "./InputPhone";

// Lista de países suportados para o controle
const countryOptions: CountryCode[] = ["BR", "US", "PT", "ES", "FR", "DE", "IT", "GB", "JP", "CN"];

const meta: Meta<typeof InputPhone> = {
  title: "Atoms/InputPhone",
  component: InputPhone,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    defaultCountry: {
      control: { type: "select" },
      options: countryOptions,
    },
    placeholder: { control: "text" },
    validateOnChange: { control: "boolean" },
  },
  args: {
    label: "Telefone",
    placeholder: "Digite seu telefone",
  },
};

export default meta;
type Story = StoryObj<typeof InputPhone>;

// 1) InputPhone padrão
export const Default: Story = {
  args: {
    label: "Telefone",
    placeholder: "+55 (11) 99999-9999",
  },
};

// 2) InputPhone com valor inicial
export const WithValue: Story = {
  args: {
    label: "Telefone",
    value: "+5511999999999",
  },
};

// 3) InputPhone com mensagem de erro
export const WithError: Story = {
  args: {
    label: "Telefone",
    error: "Número de telefone inválido",
    value: "123",
  },
};

// 4) InputPhone desabilitado
export const Disabled: Story = {
  args: {
    label: "Telefone",
    disabled: true,
    value: "+5511999999999",
  },
};

// 5) InputPhone obrigatório
export const Required: Story = {
  args: {
    label: "Telefone",
    required: true,
  },
};

// 6) InputPhone com país padrão diferente
export const WithUSCountry: Story = {
  args: {
    label: "Phone (US)",
    defaultCountry: "US",
    placeholder: "+1 (555) 123-4567",
  },
};

export const WithPTCountry: Story = {
  args: {
    label: "Telemóvel (PT)",
    defaultCountry: "PT",
    placeholder: "+351 912 345 678",
  },
};

// 7) InputPhone com validação customizada
export const WithCustomValidation: Story = {
  args: {
    label: "Telefone com validação",
    validateOnChange: true,
    placeholder: "Digite para validar automaticamente",
  },
};

// 8) Galeria de diferentes países
export const CountryGallery = () => (
  <div className="grid grid-cols-1 gap-4 max-w-md">
    <InputPhone label="Brasil (BR)" defaultCountry="BR" placeholder="+55 (11) 99999-9999" />
    <InputPhone label="Estados Unidos (US)" defaultCountry="US" placeholder="+1 (555) 123-4567" />
    <InputPhone label="Portugal (PT)" defaultCountry="PT" placeholder="+351 912 345 678" />
    <InputPhone label="Espanha (ES)" defaultCountry="ES" placeholder="+34 612 34 56 78" />
    <InputPhone label="França (FR)" defaultCountry="FR" placeholder="+33 6 12 34 56 78" />
    <InputPhone label="Alemanha (DE)" defaultCountry="DE" placeholder="+49 171 1234567" />
  </div>
);

// 9) Estados do componente
export const StatesGallery = () => (
  <div className="grid grid-cols-1 gap-4 max-w-md">
    <InputPhone label="Normal" placeholder="Telefone no estado normal" />
    <InputPhone label="Com valor" value="+5511999999999" />
    <InputPhone label="Com erro" error="Número de telefone inválido" value="123" />
    <InputPhone label="Desabilitado" disabled value="+5511999999999" />
    <InputPhone label="Obrigatório" required />
    <InputPhone label="Com validação inválida" value="123" validateOnChange={true} />
  </div>
);

// 10) Modo dark
export const InDarkMode: Story = {
  parameters: {
    themes: {
      themeOverride: "dark",
    },
  },
  args: {
    label: "Telefone (Dark Mode)",
    placeholder: "+55 (11) 99999-9999",
  },
};
