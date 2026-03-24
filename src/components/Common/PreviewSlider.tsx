"use client";

import React, { useState, useEffect } from "react";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";

export default function PreviewSliderModal() {
  const { closePreviewModal, isModalPreviewOpen, initialSlideIndex, previewImages, productTitle } = usePreviewSlider();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = previewImages ?? [];
  const hasImages = images.length > 0;
  const currentSrc = hasImages ? images[currentIndex] : null;

  useEffect(() => {
    if (isModalPreviewOpen) {
      const start = Math.min(initialSlideIndex, Math.max(0, images.length - 1));
      setCurrentIndex(start);
    }
  }, [isModalPreviewOpen, initialSlideIndex, images.length]);

  const goPrev = () => setCurrentIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const goNext = () => setCurrentIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  if (!isModalPreviewOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999]"
      style={{ isolation: "isolate" }}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      {/* Layer 1: full-screen black backdrop */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
        aria-hidden
      />

      {/* Layer 2: image (centered), behind controls */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center p-4">
        {currentSrc ? (
          <img
            src={currentSrc}
            alt={productTitle ? `${productTitle} image ${currentIndex + 1}` : "Product"}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-gray-700 text-white">
            No image
          </div>
        )}
      </div>

      {/* Layer 3: controls on top */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="pointer-events-auto">
          <button
            type="button"
            onClick={closePreviewModal}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {hasImages && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="pointer-events-auto absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="pointer-events-auto absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-black/50 px-3 py-1.5 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
