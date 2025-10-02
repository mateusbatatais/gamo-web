import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BreadcrumbsStorybook, BreadcrumbItem } from "./Breadcrumbs.storybook";
import { Gamepad2, Users, User, Settings, Home } from "lucide-react";

const meta: Meta<typeof BreadcrumbsStorybook> = {
  title: "Atoms/Breadcrumbs",
  component: BreadcrumbsStorybook,
  tags: ["autodocs"],
  argTypes: {
    condensed: {
      control: { type: "boolean" },
    },
    maxItems: {
      control: { type: "number", min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbsStorybook>;

const defaultItems: BreadcrumbItem[] = [
  { label: "Jogos", href: "/games", icon: <Gamepad2 size={16} /> },
  { label: "Meu Jogo", href: "/games/my-game" },
  { label: "Configurações", href: "/games/my-game/settings" },
];

const manyItems: BreadcrumbItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <Home size={16} /> },
  { label: "Projetos", href: "/dashboard/projects" },
  { label: "Meu Projeto", href: "/dashboard/projects/my-project" },
  { label: "Equipe", href: "/dashboard/projects/my-project/team" },
  { label: "Membros", href: "/dashboard/projects/my-project/team/members" },
  { label: "Detalhes", href: "/dashboard/projects/my-project/team/members/details" },
];

const itemsWithIcons: BreadcrumbItem[] = [
  { label: "Usuários", href: "/users", icon: <Users size={16} /> },
  { label: "Perfil", href: "/users/profile", icon: <User size={16} /> },
  { label: "Editar", href: "/users/profile/edit", icon: <Settings size={16} /> },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    condensed: false,
    maxItems: 3,
  },
};

export const Condensed: Story = {
  args: {
    items: defaultItems,
    condensed: true,
    maxItems: 3,
  },
};

export const ManyItems: Story = {
  args: {
    items: manyItems,
    condensed: true,
    maxItems: 3,
  },
};

export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    condensed: false,
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: "Dashboard", href: "/dashboard" }],
    condensed: false,
  },
};

export const LastItemNotClickable: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Produtos", href: "/products" },
      { label: "Detalhes do Produto" }, // Sem href - não clicável
    ],
    condensed: false,
  },
};

export const EmptyBreadcrumbs: Story = {
  args: {
    items: [],
    condensed: false,
  },
};

export const CustomMaxItems: Story = {
  args: {
    items: [
      { label: "Nível 1", href: "/level1" },
      { label: "Nível 2", href: "/level1/level2" },
      { label: "Nível 3", href: "/level1/level2/level3" },
      { label: "Nível 4", href: "/level1/level2/level3/level4" },
    ],
    condensed: true,
    maxItems: 2,
  },
};
