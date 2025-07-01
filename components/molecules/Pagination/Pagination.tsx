import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/Button/Button";

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

  const getPageNumbers = useCallback(() => {
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

    if (currentPage + delta > totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }, [currentPage, totalPages, isMobile]);

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className={clsx("flex items-center justify-center mt-8 gap-1", className)}>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        variant="secondary"
        className={clsx("rounded-full ", isMobile && "h-10 w-10")}
        aria-label="Página anterior"
        icon={<ChevronLeft size={18} />}
      >
        {!isMobile && <span className="ml-1">Anterior</span>}
      </Button>

      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 flex items-center text-gray-500"
                aria-label="Mais páginas"
              >
                <MoreHorizontal size={16} />
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={page === currentPage ? "primary" : "secondary"}
              onClick={() => {
                if (page !== currentPage) {
                  onPageChange(Number(page));
                }
              }}
              className={clsx("rounded-full h-10 w-10", page === currentPage && "!cursor-default")}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        variant="secondary"
        className={clsx("rounded-full", isMobile && "h-10 w-10")}
        aria-label="Próxima página"
        icon={<ChevronRight size={18} />}
      >
        {!isMobile && <span className="mr-1">Próxima</span>}
      </Button>
    </div>
  );
};

export default Pagination;
