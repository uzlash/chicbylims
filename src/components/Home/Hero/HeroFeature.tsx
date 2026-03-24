"use client";

import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

const FREE_SHIPPING_THRESHOLD_NGN = 50_000;

type FeatureRow =
  | { img: string; title: string; kind: "freeShipping" }
  | { img: string; title: string; kind: "static"; description: string };

const featureData: FeatureRow[] = [
  { img: "/images/icons/icon-01.svg", title: "Free Shipping", kind: "freeShipping" },
  {
    img: "/images/icons/icon-02.svg",
    title: "1 & 1 Returns",
    kind: "static",
    description: "Cancellation after 1 day",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Secure Payments",
    kind: "static",
    description: "Gurantee secure payments",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "24/7 Dedicated Support",
    kind: "static",
    description: "Anywhere & anytime",
  },
];

const HeroFeature = () => {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const freeShippingLine = `For all orders ${symbol}${formatPrice(toDisplayAmount(FREE_SHIPPING_THRESHOLD_NGN), currency)}+`;

  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-6 sm:gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">
                {item.kind === "freeShipping" ? freeShippingLine : item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
