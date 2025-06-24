// app/[locale]/(site)/layout.tsx

import { ReactNode } from "react";
import Footer from "@/components/templates/Layout/Footer/Footer";
import Header from "@/components/templates/Layout/Header/Header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
