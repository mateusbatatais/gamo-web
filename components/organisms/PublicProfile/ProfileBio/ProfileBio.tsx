// components/organisms/PublicProfile/ProfileBio/ProfileBio.tsx
import React from "react";
import { Card } from "@/components/atoms/Card/Card";

interface ProfileBioProps {
  bio?: string;
}

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  const defaultBio = `
  Todas as minhas notas se baseiam na minha experiência pessoal e não nos aspectos técnicos do jogo:
  1 - Homível, quase nada se salva dessa experiência;
  2 - Ruim, mas com algumas coisas boas que salvam;
  3 - OK. Muita coisa legal, muita coisa ruim;
  `;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Bio</h3>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{bio || defaultBio}</p>
    </Card>
  );
};
