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
    </Card>
  );
};
