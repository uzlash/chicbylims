"use client";

import React, { useEffect, useState } from "react";
import { useCurrency } from "@/app/context/CurrencyContext";

type Props = {
  /** Rotating messages shown centered in the bar. CMS-overridable later. */
  messages?: string[];
};

const DEFAULT_MESSAGES = [
  "WELCOME TO CHIBYLIMS — AUTHENTIC AFRICAN FABRICS & READY-TO-WEAR",
  "FREE SHIPPING ON ORDERS OVER ₦182,000",
  "NEW SUMMER COLLECTION NOW LIVE",
];

const AnnouncementBar = ({ messages = DEFAULT_MESSAGES }: Props) => {
  const { currency, setCurrency } = useCurrency();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const t = window.setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      4500
    );
    return () => window.clearInterval(t);
  }, [messages.length]);

  return (
    <div className="bg-ink text-white">
      <div className="section-container">
        <div className="flex items-center justify-between gap-3 py-2">
          {/* spacer to keep message centered on desktop */}
          <div className="hidden w-[120px] shrink-0 sm:block" />

          <p
            key={index}
            className="flex-1 truncate text-center text-2xs font-medium uppercase tracking-[0.18em] text-white/85 sm:text-custom-xs"
          >
            {messages[index]}
          </p>

          {/* Currency selector */}
          <div
            className="flex shrink-0 items-center gap-1 sm:w-[120px] sm:justify-end"
            role="group"
            aria-label="Currency"
          >
            <button
              type="button"
              onClick={() => setCurrency("NGN")}
              className={`px-1.5 text-2xs font-medium uppercase tracking-[0.12em] transition-colors ${
                currency === "NGN" ? "text-white" : "text-white/55 hover:text-white"
              }`}
              aria-pressed={currency === "NGN"}
            >
              ₦ NGN
            </button>
            <span className="text-white/30">/</span>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-1.5 text-2xs font-medium uppercase tracking-[0.12em] transition-colors ${
                currency === "USD" ? "text-white" : "text-white/55 hover:text-white"
              }`}
              aria-pressed={currency === "USD"}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
