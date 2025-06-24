// components/templates/PublicProfileLayout.tsx
import React, { ReactNode } from "react";

interface PublicProfileLayoutProps {
  children: ReactNode;
}

export const PublicProfileLayout = ({ children }: PublicProfileLayoutProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
    </div>
  );
};
