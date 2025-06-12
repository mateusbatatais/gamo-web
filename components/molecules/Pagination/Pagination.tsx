interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Função para gerar os números das páginas a serem exibidas
  const getPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2; // Número de páginas antes e depois da página atual

    // Caso a página atual esteja perto das extremidades, ajustamos o número de páginas mostradas
    const startPage = Math.max(1, currentPage - delta);
    const endPage = Math.min(totalPages, currentPage + delta);

    if (startPage > 1) {
      pageNumbers.push(1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 mx-2 border rounded disabled:opacity-50"
      >
        &lt; Prev
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(Number(page))}
            className={`px-4 py-2 mx-2 border rounded ${
              page === currentPage ? "bg-primary-500 text-white" : "bg-transparent"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Botão para avançar uma página */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 mx-2 border rounded disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
