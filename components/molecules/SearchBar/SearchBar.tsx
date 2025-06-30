// components/molecules/SearchBar/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button/Button";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Input } from "@/components/atoms/Input/Input";

interface SearchBarProps {
  className?: string;
  variant?: "header" | "page";
}

export function SearchBar({ className, variant = "page" }: SearchBarProps) {
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

    router.push(`/catalog?${params.toString()}`);

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
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Buscar consoles..."
            className="flex-grow"
            inputSize="md"
            icon={<Search size={18} />}
          />
          <Button
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Buscar consoles..."
              className="flex-grow"
              inputSize="md"
              icon={<Search size={18} />}
            />
            <Button onClick={handleSearch} variant="primary" className="ml-2" label="Buscar" />
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Buscar consoles..."
            className="flex-grow"
            inputSize="md"
            icon={<Search size={18} />}
          />
          <Button onClick={handleSearch} variant="primary" className="ml-2" label="Buscar" />
        </div>
      )}
    </div>
  );
}
