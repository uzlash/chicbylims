"use client";

import React, { createContext, useContext, useState } from "react";
import { Product } from "@/types/product";

interface AddToCartModalContextType {
  isOpen: boolean;
  product: Product | null;
  openWithProduct: (product: Product) => void;
  close: () => void;
}

const AddToCartModalContext = createContext<AddToCartModalContextType | undefined>(undefined);

export const useAddToCartModal = () => {
  const context = useContext(AddToCartModalContext);
  if (!context) {
    throw new Error("useAddToCartModal must be used within AddToCartModalProvider");
  }
  return context;
};

export const AddToCartModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openWithProduct = (p: Product) => {
    setProduct(p);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setProduct(null);
  };

  return (
    <AddToCartModalContext.Provider value={{ isOpen, product, openWithProduct, close }}>
      {children}
    </AddToCartModalContext.Provider>
  );
};
