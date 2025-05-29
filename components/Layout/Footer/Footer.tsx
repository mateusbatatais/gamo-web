// components/layout/Footer.tsx
"use client";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between">
        <p>© {new Date().getFullYear()} GAMO. Todos os direitos reservados.</p>
        <div className="space-x-4">
          <Link href={"terms"} className="hover:underline">
            Termos
          </Link>
          <Link href={"privacy"} className="hover:underline">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
