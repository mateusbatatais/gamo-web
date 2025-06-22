// components/molecules/AddToCollectionButton/AddToCollectionButton.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { AddToCollectionForm } from "@/components/organisms/AddToCollectionForm/AddToCollectionForm";

interface AddToCollectionButtonProps {
  consoleVariantId: number;
  consoleId: number;
  skinId: number;
  className?: string;
}

export function AddToCollectionButton({
  consoleVariantId,
  skinId,
  className,
  consoleId,
}: AddToCollectionButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      // Redirecionar para login com retorno para a página atual
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className={className}
        onClick={handleClick}
        label="Adicionar à coleção"
      ></Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} title="Adicionar à coleção">
        <AddToCollectionForm
          consoleVariantId={consoleVariantId}
          skinId={skinId}
          consoleId={consoleId}
          onSuccess={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  );
}
