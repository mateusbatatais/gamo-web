"use client";

import React, { use } from "react";
import { KitForm } from "@/components/organisms/KitForm/KitForm";
import { useUserKit } from "@/hooks/useUserKit";
import { Loader2 } from "lucide-react";

interface EditKitPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function EditKitPage({ params }: EditKitPageProps) {
  const { id, locale } = use(params);
  const { data: kit, isLoading, error } = useUserKit(parseInt(id), locale);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        Erro ao carregar kit. Tente novamente mais tarde.
      </div>
    );
  }

  return <KitForm initialData={kit} />;
}
