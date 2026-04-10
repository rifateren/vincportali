"use client";

import { useState } from "react";

type ImageWithFallbackProps = {
  src: string;
  alt: string;
  className?: string;
};

const FALLBACK_GRADIENT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230f2744'/%3E%3Cstop offset='100%25' stop-color='%231a3a5c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E";

export default function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImageSrc(FALLBACK_GRADIENT)}
    />
  );
}
