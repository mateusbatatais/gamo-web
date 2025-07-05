// components/organisms/PublicProfile/ProfileBio/ProfileBio.tsx
import React from "react";
import { Card } from "@/components/atoms/Card/Card";
import { useTranslations } from "next-intl";

interface ProfileBioProps {
  bio?: string;
}

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  const t = useTranslations("PublicProfile");

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Bio</h3>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {bio || t("defaultBio")}
      </p>

      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <h4 className="font-semibold mb-2 dark:text-white">Sistema de Avaliação</h4>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>1 - Homível, quase nada se salva dessa experiência</li>
          <li>2 - Ruim, mas com algumas coisas boas que salvam</li>
          <li>3 - OK. Muita coisa legal, muita coisa ruim</li>
          <li>4 - Bom, recomendo</li>
          <li>5 - Obra prima, experiência obrigatória</li>
        </ul>
      </div>
    </Card>
  );
};
