"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Landmark } from "lucide-react";

interface OptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/images/heritage/taj-mahal.jpg",
  containerClassName = "",
  className = "",
  fill = true,
  priority = false,
  sizes,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<ImageProps["src"]>(src);
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState<ImageProps["src"]>(src);

  // If the source changes, reset states synchronously during render
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }

  const handleError = () => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[HeritageAI Warning] Failed to load image asset: "${src}". Fallback image was shown instead. Check if this file is missing from public/images/heritage or if the URL is incorrect.`);
    }
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
          {/* Glowing pulse rings */}
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-amber-500/10 animate-ping absolute" />
            <Landmark className="h-6 w-6 text-amber-500/30" />
          </div>
        </div>
      )}

      {/* Fallback Graphic (rendered only if secondary fallback fails) */}
      {hasError && imgSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center border border-white/5">
          <Landmark className="h-10 w-10 text-amber-500/60 mb-2" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Image Unavailable</span>
        </div>
      )}

      {/* Next.js Optimized Image */}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        fill={fill}
        sizes={sizes || "(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"}
        priority={priority}
        className={`object-cover transition-all duration-700 ease-out ${
          isLoading ? "scale-105 opacity-0" : "scale-100 opacity-100"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
}
