"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import {
  CatalogGameSelector,
  CatalogGameItem,
} from "@/components/molecules/CatalogGameSelector/CatalogGameSelector";
import {
  CatalogConsoleSelector,
  CatalogConsoleItem,
} from "@/components/molecules/CatalogConsoleSelector/CatalogConsoleSelector";
import {
  CatalogAccessorySelector,
  CatalogAccessoryItem,
} from "@/components/molecules/CatalogAccessorySelector/CatalogAccessorySelector";
import { Loader2 } from "lucide-react";

const createKitSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "O preço deve ser maior que zero"),
});

type CreateKitFormData = z.infer<typeof createKitSchema>;

export const KitForm = () => {
  const router = useRouter();
  const { apiFetch } = useApiClient();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedGames, setSelectedGames] = useState<CatalogGameItem[]>([]);
  const [selectedConsoles, setSelectedConsoles] = useState<CatalogConsoleItem[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<CatalogAccessoryItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateKitFormData>({
    resolver: zodResolver(createKitSchema as never),
  });

  const onSubmit = async (data: CreateKitFormData) => {
    if (
      selectedGames.length === 0 &&
      selectedConsoles.length === 0 &&
      selectedAccessories.length === 0
    ) {
      showToast("Selecione pelo menos um item para o kit", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/kits", {
        method: "POST",
        body: {
          ...data,
          // Send new games to be created
          newGames: selectedGames.map((i) => ({
            gameId: i.gameId,
            platformId: i.platformId,
            condition: "USED",
            hasBox: false,
            hasManual: false,
            media: "PHYSICAL",
          })),
          // Send new consoles/accessories to be created
          newConsoles: selectedConsoles.map((i) => ({
            consoleId: i.consoleId,
            consoleVariantId: i.consoleVariantId,
            skinId: i.skinId,
            condition: "USED", // Defaulting to USED for now
            hasBox: false,
            hasManual: false,
          })),
          newAccessories: selectedAccessories.map((i) => ({
            accessoryId: i.accessoryId,
            accessoryVariantId: i.accessoryVariantId,
            condition: "USED",
            hasBox: false,
            hasManual: false,
          })),
          gameIds: [], // We are creating new ones
          consoleIds: [], // We are creating new ones
          accessoryIds: [], // We are creating new ones
        },
      });

      showToast("Kit criado com sucesso!", "success");
      router.push("/marketplace");
    } catch (error) {
      console.error("Error creating kit:", error);
      showToast("Erro ao criar kit. Tente novamente.", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Novo Kit</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Agrupe seus itens para vender mais rápido.
        </p>
      </div>

      {/* Basic Info */}
      <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informações Básicas
        </h2>

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Nome do Kit
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Ex: Super Nintendo Completo com Jogos"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Descrição (Opcional)
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            placeholder="Descreva o estado dos itens, motivos da venda, etc."
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Preço Total (R$)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
      </div>

      {/* Items Selection */}
      <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Selecionar Itens
        </h2>

        <CatalogGameSelector
          label="Jogos (do catálogo)"
          placeholder="Buscar jogos no catálogo..."
          selectedItems={selectedGames}
          onItemSelect={(item) => setSelectedGames((prev) => [...prev, item])}
          onItemRemove={(id) => setSelectedGames((prev) => prev.filter((i) => i.gameId !== id))}
        />

        <CatalogAccessorySelector
          label="Acessórios (do catálogo)"
          placeholder="Buscar acessórios no catálogo..."
          selectedItems={selectedAccessories}
          onItemSelect={(item) => setSelectedAccessories((prev) => [...prev, item])}
          onItemRemove={(id) =>
            setSelectedAccessories((prev) => prev.filter((i) => i.accessoryVariantId !== id))
          }
        />

        <CatalogConsoleSelector
          label="Consoles (do catálogo)"
          placeholder="Buscar consoles no catálogo..."
          selectedItems={selectedConsoles}
          onItemSelect={(item) => setSelectedConsoles((prev) => [...prev, item])}
          onItemRemove={(id) =>
            setSelectedConsoles((prev) => prev.filter((i) => i.consoleVariantId !== id))
          }
          onItemUpdate={(updatedItem) => {
            setSelectedConsoles((prev) =>
              prev.map((item) =>
                item.consoleVariantId === updatedItem.consoleVariantId ? updatedItem : item,
              ),
            );
          }}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Criando Kit...
            </>
          ) : (
            "Criar Kit"
          )}
        </button>
      </div>
    </form>
  );
};
