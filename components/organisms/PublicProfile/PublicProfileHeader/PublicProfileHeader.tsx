// components/organisms/PublicProfile/PublicProfileHeader/PublicProfileHeader.tsx
import React from "react";
import { Avatar } from "@/components/atoms/Avatar/Avatar";
import { PublicUserProfile } from "@/@types/publicProfile";
import { Button } from "@/components/atoms/Button/Button";
import Link from "next/link";

interface PublicProfileHeaderProps {
  profile: PublicUserProfile;
}

export const PublicProfileHeader = ({ profile }: PublicProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="flex-shrink-0">
        <Avatar
          src={profile.profileImage}
          alt={profile.name}
          size="xl"
          className="border-4 border-white dark:border-gray-800 shadow-lg"
          fallback={
            <span className="text-5xl text-gray-400 dark:text-gray-300">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          }
        />
      </div>

      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{profile.name}</h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Link
                href={`https://${profile.slug}.gamedesign.com`}
                target="_blank"
                className="text-primary-600 hover:underline dark:text-primary-400 text-sm"
              >
                {profile.slug}.gamedesign.com
              </Link>

              <span className="text-gray-400 hidden md:inline">•</span>

              <Link
                href="https://gamedesignhub.com.br"
                target="_blank"
                className="text-gray-600 hover:underline dark:text-gray-400 text-sm"
              >
                gamedesignhub.com.br
              </Link>

              <span className="text-gray-400 hidden md:inline">•</span>

              <Link href="#" className="text-gray-600 hover:underline dark:text-gray-400 text-sm">
                films
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">
              Seguir
            </Button>
            <Button variant="outline" size="sm">
              Mensagem
            </Button>
            <Button variant="transparent" size="sm">
              Compartilhar
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            🏆 Top Collector
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            🕹️ 10+ Consoles
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            ⭐ 50 Reviews
          </span>
        </div>
      </div>
    </div>
  );
};
