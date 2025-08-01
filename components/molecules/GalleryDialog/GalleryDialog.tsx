// components/molecules/GalleryDialog.tsx
import { Dialog as MuiDialog, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface GalleryDialogProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
  gameName: string;
}

export const GalleryDialog = ({
  open,
  onClose,
  images,
  initialIndex,
  gameName,
}: GalleryDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  // Verifica se a imagem já está carregada
  const isImageLoaded = () => {
    return imageRef.current?.complete && imageRef.current?.naturalHeight !== 0;
  };

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
    }
  }, [open, initialIndex]);

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setIsLoading(true);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setIsLoading(true);
  };

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex) return; // Não faz nada se for a mesma imagem

    setCurrentIndex(index);
    setIsLoading(true);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Verifica se a imagem já está carregada após a mudança
  useEffect(() => {
    if (isImageLoaded()) {
      setIsLoading(false);
    }
  }, [currentIndex]);

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      className="custom-dialog-root"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "var(--border-radius-xl)",
          background: "var(--color-neutral-50)",
          color: "var(--color-neutral-900)",
          maxHeight: "90vh",
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          "@apply dark:bg-gray-800 dark:text-neutral-100": {},
          overflow: "hidden",
        },
      }}
    >
      {/* Botão de fechar flutuante */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        className="
          absolute top-4 right-4 z-30
          text-white hover:text-white
          bg-black bg-opacity-50 hover:bg-opacity-75
          dark:bg-opacity-50 dark:hover:bg-opacity-75
          p-1.5
        "
        sx={{
          position: "absolute",
          zIndex: 1300,
        }}
      >
        <X className="text-white" size={24} />
      </IconButton>

      <div className="relative flex flex-col items-center bg-neutral-50 dark:bg-gray-800 flex-grow">
        {/* Botões de navegação flutuantes */}
        <IconButton
          aria-label="previous"
          onClick={handlePrev}
          className="
            absolute left-4 top-1/2 transform -translate-y-1/2 z-20
            text-white hover:text-white
            bg-black bg-opacity-50 hover:bg-opacity-75
            dark:bg-opacity-50 dark:hover:bg-opacity-75
            p-2
          "
          sx={{
            position: "absolute",
            zIndex: 1200,
          }}
        >
          <ChevronLeft size={30} />
        </IconButton>

        <IconButton
          aria-label="next"
          onClick={handleNext}
          className="
            absolute right-4 top-1/2 transform -translate-y-1/2 z-20
            text-white hover:text-white
            bg-black bg-opacity-50 hover:bg-opacity-75
            dark:bg-opacity-50 dark:hover:bg-opacity-75
            p-2
          "
          sx={{
            position: "absolute",
            zIndex: 1200,
          }}
        >
          <ChevronRight size={30} />
        </IconButton>

        {/* Overlay de loading */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-30">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* Imagem principal */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            ref={imageRef}
            src={images[currentIndex]}
            alt={`${gameName} screenshot ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
            onLoad={handleImageLoad}
            onError={() => setIsLoading(false)}
          />
        </div>

        {/* Contador de imagens */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-20">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <div className="p-2 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 overflow-x-auto">
        <div className="flex justify-center gap-2 py-2 min-w-max">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={clsx(
                "flex-shrink-0 w-16 h-16 relative border-2 rounded transition-all",
                currentIndex === index
                  ? "border-primary-500 dark:border-primary-400 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img}
                alt={`${gameName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </MuiDialog>
  );
};
