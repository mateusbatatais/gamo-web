// components/molecules/ViewToggle/ViewToggle.tsx
import { useState, useEffect } from "react";
import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";
import { ViewMode } from "@/@types/catalog-state.types";

interface ViewModeOption {
  value: ViewMode;
  label: string;
  icon: React.ReactNode;
}

const DEFAULT_VIEW_OPTIONS: ViewModeOption[] = [
  { value: "grid", label: "Grade", icon: <Grid3X3 size={20} /> },
  { value: "list", label: "Lista", icon: <List size={20} /> },
];

interface ViewToggleProps {
  onViewChange?: (view: ViewMode) => void;
  defaultView?: ViewMode;
  storageKey?: string;
  viewModeOptions?: ViewModeOption[];
}

export const ViewToggle = ({
  onViewChange,
  defaultView = "grid",
  storageKey = "catalog-view",
  viewModeOptions = DEFAULT_VIEW_OPTIONS,
}: ViewToggleProps) => {
  const [view, setView] = useState<ViewMode>(defaultView);

  useEffect(() => {
    const savedView = localStorage.getItem(storageKey) as ViewMode | null;
    if (savedView) {
      setView(savedView);
      onViewChange?.(savedView);
    }
  }, [storageKey, onViewChange]);

  const handleViewChange = (newView: ViewMode) => {
    setView(newView);
    localStorage.setItem(storageKey, newView);
    onViewChange?.(newView);
  };

  return (
    <div className="flex items-center space-x-1">
      {viewModeOptions.map((option) => (
        <Button
          key={option.value}
          onClick={() => handleViewChange(option.value)}
          variant={view === option.value ? "outline" : "transparent"}
          aria-label={option.label}
          icon={option.icon}
          data-testid={`button-${option.value}-view`}
          className="!p-1.5"
          size="sm"
        />
      ))}
    </div>
  );
};

// Export types for use in other components
export type { ViewModeOption };
