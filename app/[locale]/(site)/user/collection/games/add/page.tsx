// app/[locale]/profile/collection/games/add/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useGames } from "@/hooks/useGames";
import { useSearchParams } from "next/navigation";
import { Game } from "@/@types/catalog.types";
import { Skeleton } from "@/components/atoms/Skeleton/Skeleton";
import useGameDetails from "@/hooks/useGameDetails";
import { GameForm } from "@/components/organisms/_game/GameForm/GameForm";
import { Card } from "@/components/atoms/Card/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useBreadcrumbs } from "@/contexts/BreadcrumbsContext";
import { ImageWithFallback } from "@/components/atoms/ImageWithFallback/ImageWithFallback";
import { SelectOption } from "@/components/atoms/Select/Select";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import { usePlatformsCache } from "@/hooks/usePlatformsCache";
import { CreateGameModal } from "@/components/organisms/Modals/CreateGameModal";
import { Button } from "@/components/atoms/Button/Button";
import { Upload } from "lucide-react";
import { Link } from "@/navigation";

type Step = "game" | "form";

interface SelectionSectionProps {
  title: string;
  children: React.ReactNode;
  isSelected: boolean;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}

function SelectionSection({ title, children, isSelected, sectionRef }: SelectionSectionProps) {
  return (
    <div
      ref={sectionRef}
      className={`p-4 rounded-lg border ${
        isSelected
          ? "border-primary-500 dark:border-primary-700 bg-primary-50 dark:bg-gray-800"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

function GameCard({
  game,
  isSelected,
  onClick,
}: {
  game: Game;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer text-left transition-all focus:outline-none rounded-md ${
        isSelected
          ? "ring-1 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-gray-700"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <Card className="h-full border-0 p-0!">
        <div className="aspect-video relative">
          <ImageWithFallback
            src={game.imageUrl}
            alt={game.name}
            packageSize={32}
            fallbackClassName="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center"
            imgClassName="object-cover"
          />
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
            {game.name}
          </h4>
          {game.releaseDate && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {new Date(game.releaseDate).getFullYear()}
            </p>
          )}
        </div>
      </Card>
    </button>
  );
}

export default function AddGamePage() {
  const { user } = useAuth();

  const t = useTranslations("AddGame");
  const { setItems } = useBreadcrumbs();
  const searchParams = useSearchParams();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("game");
  const [searchQuery, setSearchQuery] = useState("");
  const { platformsMap } = usePlatformsCache();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Refs para cada seção
  const gameSectionRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const { data: games, isLoading: gamesLoading } = useGames({
    page: 1,
    perPage: 20,
    searchQuery,
  });

  const { data: gameDetails } = useGameDetails(selectedGame?.slug || "");
  const type = searchParams.get("type");

  useEffect(() => {
    setItems([
      { label: user?.slug || "", href: `/user/${user?.slug}` },
      {
        label: t("title"),
      },
    ]);

    return () => setItems([]);
  }, [setItems, t, user]);

  // Função robusta para fazer scroll
  const scrollToSection = useCallback((sectionRef: React.RefObject<HTMLDivElement | null>) => {
    const attemptScroll = () => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return true;
      }
      return false;
    };

    // Tenta imediatamente
    if (attemptScroll()) return;

    // Se não encontrou, tenta novamente após um delay
    const maxAttempts = 5;
    let currentAttempt = 0;

    const interval = setInterval(() => {
      currentAttempt++;
      if (attemptScroll() || currentAttempt >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }, []);

  // useEffect para controlar o scroll baseado no currentStep
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep === "form") {
        scrollToSection(formSectionRef);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStep, scrollToSection]);

  const handleGameSelect = (item: AutoCompleteItem) => {
    const game = games?.items.find((g) => g.id === item.id);
    if (game) {
      setSelectedGame(game);
      setCurrentStep("form");
    }
  };

  const platformOptions: SelectOption[] =
    gameDetails?.platforms?.map((platformId) => ({
      value: platformId.toString(),
      label: platformsMap[platformId],
    })) || [];

  const autocompleteItems: AutoCompleteItem[] =
    games?.items.map((game) => ({
      id: game.id,
      label: game.name,
      imageUrl: game.imageUrl,
      subtitle: game.releaseDate ? new Date(game.releaseDate).getFullYear().toString() : undefined,
    })) || [];

  return (
    <div className="container mx-auto max-w-6xl sm:px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {type === "collection"
          ? t("title")
          : searchParams.get("status") === "LOOKING_FOR"
            ? t("wishlistTitle")
            : searchParams.get("status") === "SELLING"
              ? t("saleTitle")
              : t("titleMarket")}
      </h1>

      {/* Bulk Import Button */}
      <Link href="/user/collection/games/import" className="block mb-8">
        <Button
          variant="primary"
          size="lg"
          label={t("bulkImportButton")}
          icon={<Upload size={20} />}
          className="w-full justify-center"
        />
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <SelectionSection
            title={t("selectGame")}
            isSelected={currentStep === "game"}
            sectionRef={gameSectionRef}
          >
            <AutoComplete
              items={autocompleteItems}
              onItemSelect={handleGameSelect}
              onSearch={setSearchQuery}
              loading={gamesLoading}
              placeholder={t("searchPlaceholder")}
              renderItem={(item) => (
                <div className="flex items-center gap-3 p-2">
                  <div className="shrink-0 w-12 h-12 relative">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.label}
                      packageSize={50}
                      fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
                      imgClassName="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.label}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                    )}
                  </div>
                </div>
              )}
              noResultsContent={
                <div className="flex flex-col items-center gap-2 p-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("noResultsFound")}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(true)}
                    label={t("includeManually")}
                  />
                </div>
              }
            />

            <CreateGameModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={(newGame) => {
                setSelectedGame(newGame);
                setCurrentStep("form");
              }}
              initialName={searchQuery}
            />

            {/* Grid de jogos sugeridos quando não há busca */}
            {!searchQuery && (
              <div className="mt-6">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                  {t("popularGames")}
                </h4>
                {gamesLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {[...Array(12)].map((_, i) => (
                      <Card key={i} className="p-0 overflow-hidden">
                        <Skeleton className="aspect-video w-full" animated />
                        <div className="p-3">
                          <Skeleton className="h-4 w-3/4 mb-2" animated />
                          <Skeleton className="h-3 w-1/2" animated />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {games?.items.slice(0, 12).map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        isSelected={selectedGame?.id === game.id}
                        onClick={() =>
                          handleGameSelect({
                            id: game.id,
                            label: game.name,
                            imageUrl: game.imageUrl,
                            subtitle: game.releaseDate
                              ? new Date(game.releaseDate).getFullYear().toString()
                              : undefined,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </SelectionSection>
        </div>

        <div className="w-full lg:w-1/2">
          {currentStep === "form" && selectedGame && (
            <div className="sticky top-4" ref={formSectionRef}>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 relative shrink-0">
                    <ImageWithFallback
                      src={selectedGame.imageUrl}
                      alt={selectedGame.name}
                      packageSize={70}
                      fallbackClassName="bg-gray-200 dark:bg-gray-700 w-full h-full flex items-center justify-center rounded"
                      imgClassName="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedGame.name}
                    </h2>
                    {selectedGame.releaseDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(selectedGame.releaseDate).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>

                <GameForm
                  mode="create"
                  type={type as "collection" | "trade" | undefined}
                  gameId={selectedGame.id}
                  gameSlug={selectedGame.slug}
                  platformOptions={platformOptions}
                  forcedStatus={
                    (["SELLING", "LOOKING_FOR"].includes(searchParams.get("status") || "")
                      ? searchParams.get("status")
                      : undefined) as "SELLING" | "LOOKING_FOR" | undefined
                  }
                  onSuccess={() => {
                    window.location.href = `/user/${user?.slug}${type === "collection" ? "/games" : "/market"}`;
                  }}
                  onCancel={() => setCurrentStep("game")}
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
