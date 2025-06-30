import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Função para gerar os números das páginas a serem exibidas
  const getPageNumbers = () => {
    if (totalPages <= 1) return [];

    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    const delta = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - delta);
    let endPage = Math.min(totalPages, currentPage + delta);

    // Ajustar se estiver perto do início
    if (currentPage - delta < 1) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }

    // Ajustar se estiver perto do fim
    if (currentPage + delta > totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Adicionar primeira página e ellipsis se necessário
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Adicionar páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Adicionar última página e ellipsis se necessário
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={clsx("flex items-center justify-center mt-8 gap-1", className)}>
      {/* Botão anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={clsx(
          "p-2 rounded-full border flex items-center",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        )}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
        {!isMobile && <span className="ml-1">Anterior</span>}
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 flex items-center">
                <MoreHorizontal size={16} />
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(Number(page))}
              className={clsx(
                "min-w-[2.5rem] h-10 rounded-full flex items-center justify-center",
                "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                page === currentPage ? "bg-primary-500 text-white border-primary-500" : "border",
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Próximo botão */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={clsx(
          "p-2 rounded-full border flex items-center",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        )}
        aria-label="Próxima página"
      >
        {!isMobile && <span className="mr-1">Próxima</span>}
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
