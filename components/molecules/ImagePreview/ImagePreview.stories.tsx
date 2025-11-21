import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImagePreview } from "./ImagePreview";
import { fn } from "storybook/test";

const meta: Meta<typeof ImagePreview> = {
  title: "Molecules/ImagePreview",
  component: ImagePreview,
  tags: ["autodocs"],
  args: {
    src: "/images/consoles/sony/ps1-fat.webp",
    onRemove: fn(),
    onCropComplete: fn(),
  },
  argTypes: {
    src: {
      control: "text",
      description: "URL da imagem para pré-visualização",
    },
    onRemove: {
      action: "removed",
      description: "Chamado quando o botão de remover é clicado",
    },
    onCropComplete: {
      action: "crop-completed",
      description: "Chamado quando o corte é aplicado com o blob resultante",
    },
  },
  parameters: {
    // Mock de traduções para o Storybook
    nextIntl: {
      messages: {
        common: {
          notEdited: "Not Edited",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImagePreview>;

export const Default: Story = {
  args: {},
};

const ImagePreviewGrid = () => (
  <div className="flex flex-wrap gap-4 p-4">
    <ImagePreview
      src="/images/consoles/sony/ps1-fat.webp"
      onRemove={fn()}
      onCropComplete={fn()}
      initialProcessed={true}
    />
    <ImagePreview
      src="/images/consoles/sony/ps2-fat.webp"
      onRemove={fn()}
      onCropComplete={fn()}
      initialProcessed={true}
    />
    <ImagePreview
      src="/images/consoles/sony/ps3-fat.webp"
      onRemove={fn()}
      onCropComplete={fn()}
      initialProcessed={false}
    />
  </div>
);

export const MultiplePreviews: Story = {
  render: () => <ImagePreviewGrid />,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};
