"use client";

import React, { createContext, useContext } from "react";

/** Single-tenant: no multi-brand. Kept for compatibility; brand is always null. */
type Brand = null;

interface BrandContextType {
  brand: Brand;
  isHeim: boolean;
  isKinder: boolean;
}

const BrandContext = createContext<BrandContextType>({
  brand: null,
  isHeim: false,
  isKinder: false,
});

export const useBrand = () => useContext(BrandContext);

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrandContext.Provider value={{ brand: null, isHeim: false, isKinder: false }}>
      {children}
    </BrandContext.Provider>
  );
};
