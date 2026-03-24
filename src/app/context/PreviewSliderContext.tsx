"use client";
import React, { createContext, useContext, useState } from "react";

export type PreviewSliderPayload = {
  images: string[];
  initialIndex?: number;
  productTitle?: string;
};

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  initialSlideIndex: number;
  previewImages: string[];
  productTitle: string | null;
  openPreviewModal: (payload: PreviewSliderPayload) => void;
  closePreviewModal: () => void;
}

const PreviewSlider = createContext<PreviewSliderType | undefined>(undefined);

export const usePreviewSlider = () => {
  const context = useContext(PreviewSlider);
  if (!context) {
    throw new Error("usePreviewSlider must be used within a ModalProvider");
  }
  return context;
};

export const PreviewSliderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalPreviewOpen, setIsModalOpen] = useState(false);
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [productTitle, setProductTitle] = useState<string | null>(null);

  const openPreviewModal = (payload: PreviewSliderPayload) => {
    const { images, initialIndex = 0, productTitle: title } = payload;
    setPreviewImages(Array.isArray(images) ? images : []);
    setInitialSlideIndex(Math.min(initialIndex, Math.max(0, images.length - 1)));
    setProductTitle(title ?? null);
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PreviewSlider.Provider
      value={{
        isModalPreviewOpen,
        initialSlideIndex,
        previewImages,
        productTitle,
        openPreviewModal,
        closePreviewModal,
      }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
