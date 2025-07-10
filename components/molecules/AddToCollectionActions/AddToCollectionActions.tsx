// Novo componente AddToCollectionActions.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { AddToCollectionForm } from "@/components/organisms/AddToCollectionForm/AddToCollectionForm";
import { DollarSign, Plus } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { apiFetch } from "@/utils/api";

interface Props {
  consoleVariantId: number;
  consoleId: number;
  skinId: number;
}

export function AddToCollectionActions({ consoleVariantId, skinId, consoleId }: Props) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"OWNED" | "TRADE">("OWNED");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleAction = (type: "OWNED" | "TRADE") => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (type === "OWNED") {
      addToCollectionDirectly();
    } else {
      setActionType(type);
      setIsModalOpen(true);
    }
  };

  const addToCollectionDirectly = async () => {
    setLoading(true);
    try {
      // Chamada API simplificada para OWNED
      await apiFetch("/user-consoles", {
        method: "POST",
        token,
        body: {
          consoleVariantId,
          consoleId,
          skinId,
          status: "OWNED",
          condition: "USED",
        },
      });
      showToast("Adicionado a coleção", "success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "danger");
      } else {
        showToast("err.message", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleAction("OWNED")}
        loading={loading}
        icon={<Plus size={16} />}
        label="Adicionar à coleção"
        className="w-full"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("TRADE")}
          icon={<DollarSign size={16} />}
          label="Compra e venda"
          className="flex-1"
        />
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Adicionar à coleção"}
      >
        <AddToCollectionForm
          consoleVariantId={consoleVariantId}
          skinId={skinId}
          consoleId={consoleId}
          onSuccess={() => setIsModalOpen(false)}
          initialStatus={actionType}
        />
      </Dialog>
    </div>
  );
}
