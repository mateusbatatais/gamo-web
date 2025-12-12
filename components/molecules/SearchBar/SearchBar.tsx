// components/molecules/SearchBar/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button/Button";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Input } from "@/components/atoms/Input/Input";

interface SearchBarProps {
  className?: string;
  variant?: "header" | "page";
  compact?: boolean;
  searchPath: string;
  placeholder?: string;
}

export function SearchBar({
  className,
  variant = "page",
  compact = false,
  searchPath,
  placeholder = "Buscar...",
}: SearchBarProps) {
  const t = useTranslations("filters");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set("search", query);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.push(`${searchPath}?${params.toString()}`);

    // Recolher a busca em mobile após pesquisa
    if (variant === "header" && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Efeito para focar no input quando expandir no mobile
  useEffect(() => {
    if (isExpanded && variant === "header" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded, variant]);

  const clearSearch = () => {
    setQuery("");

    // Remover o parâmetro 'search' da URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${searchPath}?${params.toString()}`);

    inputRef.current?.focus();
  };

  const clearButton = query ? (
    <button
      type="button"
      onClick={clearSearch}
      className="mt-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      aria-label={t("clearSearch")}
    >
      <X size={16} />
    </button>
  ) : null;

  return (
    <div
      className={clsx(
        "flex items-center w-full",
        variant === "header" ? "max-w-none" : "",
        className,
      )}
    >
      {variant === "header" && isExpanded && (
        <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 shadow-md z-10 flex items-center">
          <Input
            data-testid="search-input"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="grow"
            inputSize={compact ? "sm" : "md"}
            icon={<Search size={18} />}
            rightElement={clearButton}
          />
          <Button
            data-testid="search-button"
            onClick={() => setIsExpanded(false)}
            variant="transparent"
            className="ml-2"
            icon={<X size={20} />}
          />
        </div>
      )}

      {variant === "header" ? (
        <div className="flex items-center w-full">
          <div className="hidden md:flex items-center w-full max-w-xl mx-auto">
            <Input
              data-testid="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="grow"
              inputSize={compact ? "sm" : "md"}
              icon={<Search size={18} />}
              ref={inputRef}
              rightElement={clearButton}
            />
            <Button
              data-testid="search-button"
              onClick={handleSearch}
              variant="primary"
              className="ml-2"
              label="Buscar"
              size={compact ? "sm" : "md"}
            />
          </div>

          <Button
            onClick={() => setIsExpanded(true)}
            variant="transparent"
            className="md:hidden ml-2"
            icon={<Search size={20} />}
          />
        </div>
      ) : (
        <div className="flex items-center w-full">
          <Input
            data-testid="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="grow"
            inputSize={compact ? "sm" : "md"}
            icon={<Search size={18} />}
            ref={inputRef}
            rightElement={clearButton}
          />
          <Button
            data-testid="search-button"
            onClick={handleSearch}
            variant="primary"
            className="ml-2"
            label="Buscar"
            size={compact ? "sm" : "md"}
          />
        </div>
      )}
    </div>
  );
}
