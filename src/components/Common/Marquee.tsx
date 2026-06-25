"use client";

import React from "react";

type Props = {
  items?: string[];
  /** light strip on cream, or dark strip on ink */
  variant?: "light" | "dark";
  speed?: "normal" | "fast";
};

const DEFAULT_ITEMS = [
  "STANDARD DELIVERY WITHIN 24HRS IN ABUJA",
  "FREE SHIPPING ON ORDERS OVER ₦182,000",
  "UP TO 70% OFF FINAL CLEARANCE",
  "EASY 7-DAY RETURN POLICY",
];

const Marquee = ({ items = DEFAULT_ITEMS, variant = "light", speed = "normal" }: Props) => {
  const tone =
    variant === "dark"
      ? "bg-ink text-white/85 border-y border-white/10"
      : "bg-cream text-dark border-y border-cream-dark";

  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className={`overflow-hidden ${tone}`}>
      <div className="marquee-mask py-2.5">
        <div
          className={`flex w-max items-center whitespace-nowrap ${
            speed === "fast" ? "animate-marquee-fast" : "animate-marquee"
          }`}
        >
          {loop.map((text, i) => (
            <span
              key={i}
              className="flex items-center text-2xs font-medium uppercase tracking-[0.2em] sm:text-custom-xs"
            >
              {text}
              <span className="mx-6 inline-block h-1 w-1 rounded-full bg-current opacity-40 sm:mx-9" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
