// components/templates/Layout/Footer/Footer.tsx
"use client";

import { Link } from "@/i18n/navigation";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 dark:bg-gray-900 dark:text-gray-400">
      <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} GAMO. Todos os direitos reservados.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={"/terms"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            Termos
          </Link>
          <Link
            href={"/privacy"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            Privacidade
          </Link>
          <Link
            href={"/contact"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            Contato
          </Link>
          <Link
            href={"/about"}
            className="hover:underline dark:text-gray-300 dark:hover:text-gray-100"
          >
            Sobre
          </Link>
        </div>
      </div>
    </footer>
  );
}
