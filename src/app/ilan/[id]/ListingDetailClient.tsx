"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";

type ListingDetailClientProps = {
  title: string;
  images: string[];
};

export default function ListingDetailClient({ title, images }: ListingDetailClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const lightboxTouchStartX = useRef<number | null>(null);

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const activeImage = safeImages[activeIndex] ?? null;

  const handlePrevImage = useCallback(() => {
    if (safeImages.length < 2) return;
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }, [safeImages.length]);

  const handleNextImage = useCallback(() => {
    if (safeImages.length < 2) return;
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const dialog = lightboxRef.current;
    if (dialog) {
      const closeBtn = dialog.querySelector<HTMLElement>("button");
      closeBtn?.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowLeft") {
        handlePrevImage();
      }
      if (event.key === "ArrowRight") {
        handleNextImage();
      }
      if (event.key === "Tab" && dialog) {
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox, handleNextImage, handlePrevImage, isLightboxOpen]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        {activeImage ? (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="block w-full cursor-zoom-in bg-slate-50"
            aria-label="Görseli büyüt"
          >
            <CldImage
              src={activeImage}
              alt={title}
              width={1400}
              height={1000}
              quality="auto"
              format="auto"
              crop="limit"
              className="h-[360px] w-full object-contain sm:h-[440px] lg:h-[520px]"
            />
          </button>
        ) : (
          <div className="flex h-[360px] items-center justify-center text-slate-500">
            Görsel yok
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {safeImages.map((imageId, index) => (
            <button
              key={`${imageId}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`min-h-[48px] overflow-hidden rounded-lg border ${
                index === activeIndex
                  ? "border-[#f97316]"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <CldImage
                src={imageId}
                alt={`${title} - ${index + 1}`}
                width={120}
                height={90}
                quality="auto"
                format="auto"
                crop="limit"
                className="h-20 w-full bg-slate-100 object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && activeImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Görsel büyütme penceresi"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-3 top-3 z-10 flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg bg-black/50 px-4 text-sm font-semibold text-white hover:bg-black/70 sm:right-4 sm:top-4"
            aria-label="Büyütmeyi kapat"
          >
            Kapat
          </button>

          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-1 top-1/2 z-10 flex min-h-[52px] min-w-[52px] -translate-y-1/2 items-center justify-center rounded-lg bg-black/50 text-2xl font-semibold text-white hover:bg-black/70 sm:left-4"
                aria-label="Önceki görsel"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-1 top-1/2 z-10 flex min-h-[52px] min-w-[52px] -translate-y-1/2 items-center justify-center rounded-lg bg-black/50 text-2xl font-semibold text-white hover:bg-black/70 sm:right-4"
                aria-label="Sonraki görsel"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative flex h-full w-full max-w-6xl touch-pan-y items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(e) => {
              lightboxTouchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const start = lightboxTouchStartX.current;
              lightboxTouchStartX.current = null;
              if (start === null || safeImages.length < 2) return;
              const end = e.changedTouches[0]?.clientX;
              if (end === undefined) return;
              const dx = end - start;
              if (dx > 56) handlePrevImage();
              else if (dx < -56) handleNextImage();
            }}
          >
            <CldImage
              src={activeImage}
              alt={`${title} - büyütülmüş`}
              width={2200}
              height={1600}
              quality="auto"
              format="auto"
              crop="limit"
              className="max-h-[90vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

