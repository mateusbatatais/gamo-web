import React, { useState, useMemo, useRef, useEffect } from "react";
import { Checkbox } from "../Checkbox/Checkbox";
import { Input } from "../Input/Input";
import { Search } from "lucide-react";

interface MultiSelectItem {
  id: number;
  name: string;
}

interface MultiSelectProps {
  items: MultiSelectItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  items,
  selectedIds,
  onChange,
  label,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  maxHeight = "max-h-60",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, searchQuery]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const checked = e.target.checked;

    if (checked) {
      onChange([...selectedIds, value]);
    } else {
      onChange(selectedIds.filter((id) => id !== value));
    }
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Estimate dropdown height (max-h-60 = 240px + padding + search)
      const estimatedDropdownHeight = 300;

      // Open upward if not enough space below but enough space above
      setOpenUpward(spaceBelow < estimatedDropdownHeight && spaceAbove > estimatedDropdownHeight);
    }
  }, [isOpen]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        <div
          className="min-h-[42px] p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 cursor-pointer flex flex-wrap gap-2"
          onClick={toggleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleOpen();
              e.preventDefault();
            }
          }}
        >
          {selectedIds.length > 0 ? (
            selectedIds.map((id) => {
              const item = items.find((i) => i.id === id);
              if (!item) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  {item.name}
                </span>
              );
            })
          ) : (
            <span className="text-gray-400 text-sm py-1">{placeholder}</span>
          )}
        </div>

        {isOpen && (
          <div
            className={`absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                icon={<Search size={16} />}
              />
            </div>
            <div className={`overflow-y-auto ${maxHeight} p-2 space-y-1`}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <Checkbox
                      name={`multiselect-${item.id}`}
                      value={item.id}
                      checked={selectedIds.includes(item.id)}
                      onChange={handleCheckboxChange}
                      label={item.name}
                    />
                  </div>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500 text-center">No items found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
          style={{ pointerEvents: "auto", backgroundColor: "transparent" }}
        />
      )}
    </div>
  );
};
