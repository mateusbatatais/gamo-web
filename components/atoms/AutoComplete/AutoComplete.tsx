// components/atoms/Autocomplete/Autocomplete.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input, InputProps } from "../Input/Input";
import { Search } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";
import { Skeleton } from "../Skeleton/Skeleton";

export interface AutocompleteItem {
  id: number;
  label: string;
  imageUrl?: string | null;
  type?: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface AutocompleteProps extends Omit<InputProps, "onChange" | "value"> {
  items: AutocompleteItem[];
  onItemSelect: (item: AutocompleteItem) => void;
  onSearch: (query: string) => void;
  loading?: boolean;
  value?: string;
  renderItem?: (item: AutocompleteItem) => React.ReactNode;
}

export const Autocomplete = ({
  items,
  onItemSelect,
  onSearch,
  loading = false,
  value = "",
  renderItem,
  placeholder = "Buscar...",
  ...inputProps
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(value.length > 0);
  };

  const handleSelect = useCallback(
    (item: AutocompleteItem) => {
      setInputValue(item.label);
      setIsOpen(false);
      onItemSelect(item);
    },
    [onItemSelect],
  );

  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setIsOpen(true);
    }
  };

  const defaultRenderItem = (item: AutocompleteItem) => (
    <div className="flex items-center gap-3 p-2">
      <div className="flex-shrink-0 w-8 h-8 relative">
        <ImageWithFallback
          src={item.imageUrl}
          alt={item.label}
          packageSize={20}
          fallbackClassName="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
          imgClassName="object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.label}</p>
        {item.type && (
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.type}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        {...inputProps}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        icon={<Search size={18} className="text-gray-400" />}
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded" animated />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" animated />
                    <Skeleton className="h-3 w-1/2" animated />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                onClick={() => handleSelect(item)}
              >
                {renderItem ? renderItem(item) : defaultRenderItem(item)}
              </button>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
};
