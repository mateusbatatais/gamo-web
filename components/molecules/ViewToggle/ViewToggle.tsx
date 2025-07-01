// components/molecules/ViewToggle/ViewToggle.tsx
import { useState, useEffect } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/atoms/Button/Button";

export type ViewType = "grid" | "list";

interface ViewToggleProps {
  onViewChange?: (view: ViewType) => void;
  defaultView?: ViewType;
  storageKey?: string;
}

export const ViewToggle = ({
  onViewChange,
  defaultView = "grid",
  storageKey = "catalog-view",
}: ViewToggleProps) => {
  const [view, setView] = useState<ViewType>(defaultView);

  useEffect(() => {
    const savedView = localStorage.getItem(storageKey) as ViewType | null;
    if (savedView) {
      setView(savedView);
      onViewChange?.(savedView);
    }
  }, [storageKey, onViewChange]);

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem(storageKey, newView);
    onViewChange?.(newView);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        onClick={() => handleViewChange("grid")}
        variant={view === "grid" ? "outline" : "transparent"}
        aria-label="Grid view"
        icon={<LayoutGrid size={20} />}
        data-testid="button-grid-view"
      ></Button>
      <Button
        onClick={() => handleViewChange("list")}
        variant={view === "list" ? "outline" : "transparent"}
        aria-label="List view"
        icon={<List size={20} />}
        data-testid="button-list-view"
      ></Button>
    </div>
  );
};
