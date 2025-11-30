import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Button } from "@/components/atoms/Button/Button";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Game } from "@/@types/catalog.types";
import { MultiSelect } from "@/components/atoms/MultiSelect/MultiSelect";
import { AutoComplete, AutoCompleteItem } from "@/components/atoms/AutoComplete/AutoComplete";
import useGenres from "@/hooks/filters/useGenres";
import usePlatforms from "@/hooks/filters/usePlatforms";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (game: Game) => void;
  initialName?: string;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = "",
}) => {
  const t = useTranslations("CreateGameModal");
  const { token } = useAuth();

  // Form State
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [metacritic, setMetacritic] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedParentPlatforms, setSelectedParentPlatforms] = useState<number[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [seriesId, setSeriesId] = useState<number | undefined>(undefined);

  // Sync name with initialName when it changes
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [seriesSearchResults, setSeriesSearchResults] = useState<AutoCompleteItem[]>([]);
  const [isSearchingSeries, setIsSearchingSeries] = useState(false);

  // Data Hooks
  const { data: genresData } = useGenres();
  const { data: platformsData } = usePlatforms();

  // Derived Data
  const parentPlatformsOptions = useMemo(() => {
    return platformsData?.results.map((p) => ({ id: p.id, name: p.name })) || [];
  }, [platformsData]);

  const availablePlatformsOptions = useMemo(() => {
    if (!platformsData) return [];

    if (selectedParentPlatforms.length === 0) {
      return platformsData.results
        .flatMap((pp) => pp.platforms)
        .map((p) => ({ id: p.id, name: p.name }));
    }

    return platformsData.results
      .filter((pp) => selectedParentPlatforms.includes(pp.id))
      .flatMap((pp) => pp.platforms)
      .map((p) => ({ id: p.id, name: p.name }));
  }, [platformsData, selectedParentPlatforms]);

  const handleSeriesSearch = useCallback(
    async (query: string) => {
      if (!query || query.length < 2) {
        setSeriesSearchResults([]);
        return;
      }

      setIsSearchingSeries(true);
      try {
        const response = await apiFetch<{ items: Game[] }>(
          `/games?search=${encodeURIComponent(query)}&perPage=5`,
          {
            token,
          },
        );
        setSeriesSearchResults(
          response.items.map((g) => ({ id: g.id, label: g.name, imageUrl: g.imageUrl })),
        );
      } catch (err) {
        console.error("Error searching series:", err);
      } finally {
        setIsSearchingSeries(false);
      }
    },
    [token],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (selectedGenres.length === 0) {
      setError(t("genresRequired"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newGame = await apiFetch<Game>("/games", {
        method: "POST",
        body: {
          name,
          description: description || undefined,
          metacritic: metacritic ? Number(metacritic) : undefined,
          genres: selectedGenres,
          parentPlatforms: selectedParentPlatforms.length > 0 ? selectedParentPlatforms : undefined,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
          seriesId,
        },
        token,
      });
      onSuccess(newGame);
      onClose();
    } catch (err) {
      console.error(err);
      setError(t("errorCreating"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} title={t("title")}>
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t("description")}</p>

        <Input
          label={t("nameLabel")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          error={error}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-700 dark:text-neutral-200">
            {t("descriptionLabel")}
          </label>
          <textarea
            className="block w-full border rounded-md transition focus:outline-none py-2 px-3 text-base border-gray-300 focus:border-primary-500 dark:border-gray-700 dark:focus:border-primary-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
          />
        </div>

        <Input
          label={t("metacriticLabel")}
          type="number"
          value={metacritic}
          onChange={(e) => setMetacritic(e.target.value)}
          placeholder="0-100"
          min={0}
          max={100}
        />

        <MultiSelect
          label={t("genresLabel")}
          items={genresData?.results || []}
          selectedIds={selectedGenres}
          onChange={setSelectedGenres}
          placeholder={t("selectGenres")}
        />

        <MultiSelect
          label={t("parentPlatformsLabel")}
          items={parentPlatformsOptions}
          selectedIds={selectedParentPlatforms}
          onChange={setSelectedParentPlatforms}
          placeholder={t("selectParentPlatforms")}
        />

        <MultiSelect
          label={t("platformsLabel")}
          items={availablePlatformsOptions}
          selectedIds={selectedPlatforms}
          onChange={setSelectedPlatforms}
          placeholder={t("selectPlatforms")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-neutral-700 dark:text-neutral-200">
            {t("seriesLabel")}
          </label>
          <AutoComplete
            items={seriesSearchResults}
            onSearch={handleSeriesSearch}
            onItemSelect={(item) => setSeriesId(item.id)}
            loading={isSearchingSeries}
            placeholder={t("searchSeriesPlaceholder")}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} label={t("cancel")} />
          <Button
            type="submit"
            loading={isLoading}
            label={t("create")}
            disabled={!name.trim() || selectedGenres.length === 0}
          />
        </div>
      </form>
    </Dialog>
  );
};
