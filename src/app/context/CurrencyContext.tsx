"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CurrencyCode = "NGN" | "USD";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  /** Convert NGN amount to display value in active currency (NGN returns same, USD converts). */
  toDisplayAmount: (amountNgn: number) => number;
  /** Symbol for current currency. */
  symbol: string;
}

const STORAGE_KEY = "chibylims-currency";

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "NGN",
  setCurrency: () => {},
  toDisplayAmount: (n) => n,
  symbol: "₦",
});

export const useCurrency = () => useContext(CurrencyContext);

/** NGN to USD rate (1 NGN = this many USD). Default fallback if env not set. */
function getNgnToUsdRate(): number {
  if (typeof process.env.NEXT_PUBLIC_NGN_TO_USD_RATE === "string") {
    const parsed = parseFloat(process.env.NEXT_PUBLIC_NGN_TO_USD_RATE);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0.0006;
}

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored === "NGN" || stored === "USD") setCurrencyState(stored);
    setMounted(true);
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, c);
  };

  const rate = getNgnToUsdRate();
  const toDisplayAmount = (amountNgn: number) =>
    currency === "USD" ? amountNgn * rate : amountNgn;
  const symbol = currency === "USD" ? "$" : "₦";

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    toDisplayAmount,
    symbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
