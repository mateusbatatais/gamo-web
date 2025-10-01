import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AutoComplete, AutoCompleteItem, AutoCompleteProps } from "./AutoComplete";
import { useState, useCallback } from "react";
import { User, Users, Gamepad2 } from "lucide-react";

const meta: Meta<typeof AutoComplete> = {
  title: "Atoms/AutoComplete",
  component: AutoComplete,
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: { type: "boolean" },
    },
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AutoComplete>;

// Dados mock para os stories
const mockItems: AutoCompleteItem[] = [
  {
    id: 1,
    label: "João Silva",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    type: "user",
    email: "joao@email.com",
  },
  {
    id: 2,
    label: "Maria Santos",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    type: "user",
    email: "maria@email.com",
  },
  {
    id: 3,
    label: "Time de Desenvolvimento",
    imageUrl: null,
    type: "team",
    members: 5,
  },
  {
    id: 4,
    label: "Jogo da Velha",
    imageUrl:
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=40&h=40&fit=crop&crop=center",
    type: "game",
    category: "Estratégia",
  },
  {
    id: 5,
    label: "Pedro Costa",
    imageUrl: null,
    type: "user",
    email: "pedro@email.com",
  },
];

// Componente wrapper para os stories
const AutoCompleteWrapper = (
  args: Omit<AutoCompleteProps, "items" | "onSearch" | "onItemSelect">,
) => {
  const [selectedItem, setSelectedItem] = useState<AutoCompleteItem | null>(null);
  const [searchResults, setSearchResults] = useState<AutoCompleteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setLoading(true);

    // Simular busca assíncrona
    setTimeout(() => {
      if (query.length > 0) {
        const filtered = mockItems.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
      setLoading(false);
    }, 500);
  }, []);

  const handleItemSelect = useCallback((item: AutoCompleteItem) => {
    setSelectedItem(item);
    console.log("Item selecionado:", item);
  }, []);

  return (
    <div className="space-y-4">
      <AutoComplete
        {...args}
        items={searchResults}
        onSearch={handleSearch}
        onItemSelect={handleItemSelect}
        loading={loading}
      />
      {selectedItem && (
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
          <p className="text-sm font-medium">Item selecionado:</p>
          <p className="text-sm">
            {selectedItem.label} ({selectedItem.type})
          </p>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  args: {
    placeholder: "Buscar usuários, times ou jogos...",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const WithCustomRender: Story = {
  args: {
    placeholder: "Buscar com renderização customizada...",
  },
  render: (args) => {
    const CustomRenderItem = (item: AutoCompleteItem) => (
      <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          {item.type === "user" && (
            <User size={16} className="text-primary-600 dark:text-primary-400" />
          )}
          {item.type === "team" && (
            <Users size={16} className="text-primary-600 dark:text-primary-400" />
          )}
          {item.type === "game" && (
            <Gamepad2 size={16} className="text-primary-600 dark:text-primary-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {item.type}
            {item.email && ` • ${item.email}`}
            {item.members && ` • ${item.members} membros`}
            {item.category && ` • ${item.category}`}
          </p>
        </div>
      </div>
    );

    const WrapperWithCustomRender = (
      props: Omit<AutoCompleteProps, "items" | "onSearch" | "onItemSelect">,
    ) => {
      const [selectedItem, setSelectedItem] = useState<AutoCompleteItem | null>(null);
      const [searchResults, setSearchResults] = useState<AutoCompleteItem[]>([]);
      const [loading, setLoading] = useState(false);

      const handleSearch = useCallback((query: string) => {
        setLoading(true);
        setTimeout(() => {
          if (query.length > 0) {
            const filtered = mockItems.filter((item) =>
              item.label.toLowerCase().includes(query.toLowerCase()),
            );
            setSearchResults(filtered);
          } else {
            setSearchResults([]);
          }
          setLoading(false);
        }, 500);
      }, []);

      return (
        <div className="space-y-4">
          <AutoComplete
            {...props}
            items={searchResults}
            onSearch={handleSearch}
            onItemSelect={setSelectedItem}
            loading={loading}
            renderItem={CustomRenderItem}
          />
          {selectedItem && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Item selecionado com render customizado:
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">{selectedItem.label}</p>
            </div>
          )}
        </div>
      );
    };

    return <WrapperWithCustomRender {...args} />;
  },
};

export const LoadingState: Story = {
  args: {
    placeholder: "Buscando...",
    loading: true,
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const EmptyState: Story = {
  args: {
    placeholder: "Buscar...",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    placeholder: "AutoComplete desabilitado",
    disabled: true,
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};

export const WithInitialValue: Story = {
  args: {
    placeholder: "Buscar...",
    value: "João Silva",
  },
  render: (args) => <AutoCompleteWrapper {...args} />,
};
