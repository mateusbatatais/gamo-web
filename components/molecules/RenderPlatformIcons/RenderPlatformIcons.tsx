import Image from "next/image";

export interface PlatformInfo {
  id: number;
  name: string;
  iconSrc: string;
}

export interface RenderPlatformIconsProps {
  platforms: number[];
}

export const platformIcons: Record<number, PlatformInfo> = {
  1: { id: 1, name: "PC", iconSrc: "/images/icons/platforms/windows.svg" },
  2: { id: 2, name: "PlayStation", iconSrc: "/images/icons/platforms/playstation.svg" },
  3: { id: 3, name: "Xbox", iconSrc: "/images/icons/platforms/xbox.svg" },
  4: { id: 4, name: "iOS", iconSrc: "/images/icons/platforms/ios.svg" },
  5: { id: 5, name: "Apple Macintosh", iconSrc: "/images/icons/platforms/apple.svg" },
  6: { id: 6, name: "Linux", iconSrc: "/images/icons/platforms/linux.svg" },
  7: { id: 7, name: "Nintendo", iconSrc: "/images/icons/platforms/nintendo.svg" },
  8: { id: 8, name: "Android", iconSrc: "/images/icons/platforms/android.svg" },
  9: { id: 9, name: "Atari", iconSrc: "/images/icons/platforms/atari.svg" },
  10: { id: 10, name: "Commodore / Amiga", iconSrc: "/images/icons/platforms/commodore-amiga.svg" },
  11: { id: 11, name: "SEGA", iconSrc: "/images/icons/platforms/sega.svg" },
  12: { id: 12, name: "Neo Geo", iconSrc: "/images/icons/platforms/neo-geo.svg" },
  13: { id: 13, name: "3DO", iconSrc: "/images/icons/platforms/3do.svg" },
  14: { id: 14, name: "Web", iconSrc: "/images/icons/platforms/web.svg" },
};

export const PlatformIcons = ({ platforms }: RenderPlatformIconsProps) => {
  if (!platforms?.length) return null;

  return (
    <div className="flex items-center space-x-1 mt-2">
      {platforms.map((platformId) => {
        const platform = platformIcons[platformId];
        console.log("Platform ID:", platformId, "Platform Data:", platform);
        if (!platform) return null;
        return (
          <div key={platformId} className="h-3 w-3 sm:w-5 sm:h-5 relative">
            <Image
              src={platform.iconSrc}
              alt={platform.name}
              title={platform.name}
              fill
              className="object-contain brightness-30 dark:brightness-100"
            />
          </div>
        );
      })}
    </div>
  );
};
