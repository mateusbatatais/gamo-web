// components/organisms/PublicProfile/PublicProfileHeader.tsx
import React from "react";
import Image from "next/image";
import { PublicUserProfile } from "@/@types/publicProfile";

interface PublicProfileHeaderProps {
  profile: PublicUserProfile;
}

export const PublicProfileHeader = ({ profile }: PublicProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center py-6 border-b border-gray-200">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary">
        {profile.profileImage ? (
          <Image src={profile.profileImage} alt={profile.name} fill className="object-cover" />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center">
            <span className="text-2xl text-gray-400">{profile.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold mt-4">{profile.name}</h1>
      <p className="text-gray-500">@{profile.slug}</p>

      {profile.description && (
        <p className="mt-4 max-w-2xl text-center text-gray-700">{profile.description}</p>
      )}
    </div>
  );
};
