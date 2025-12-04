"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPagination as PaginationType } from "@/types/blog";

interface BlogPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export default function BlogPagination({ pagination, onPageChange }: BlogPaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostrar primeira página
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      // Páginas ao redor da atual
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      // Sempre mostrar última página
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
    >
      {/* Info de resultados */}
      <p className="text-sm text-navy-400">
        Mostrando{" "}
        <span className="font-medium text-navy-200">
          {(page - 1) * pagination.limit + 1}
        </span>{" "}
        a{" "}
        <span className="font-medium text-navy-200">
          {Math.min(page * pagination.limit, total)}
        </span>{" "}
        de{" "}
        <span className="font-medium text-navy-200">{total}</span> artigos
      </p>

      {/* Controles de paginação */}
      <div className="flex items-center gap-2">
        {/* Botão anterior */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="text-navy-400 hover:text-white hover:bg-navy-800 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-navy-500">
                ...
              </span>
            ) : (
              <motion.button
                key={pageNum}
                onClick={() => onPageChange(pageNum as number)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  page === pageNum
                    ? "bg-gold-500 text-navy-950"
                    : "text-navy-300 hover:bg-navy-800 hover:text-white"
                }`}
              >
                {pageNum}
              </motion.button>
            )
          )}
        </div>

        {/* Botão próximo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="text-navy-400 hover:text-white hover:bg-navy-800 disabled:opacity-30"
        >
          Próximo
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}
