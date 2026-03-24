"use client";

import React from "react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

export type DeliveryOption = "store_pickup" | "abuja" | "interstate";

export const DELIVERY_FEES: Record<DeliveryOption, number> = {
  store_pickup: 0,
  abuja: 5000,
  interstate: 7000, // default zone; actual fee from selected zone
};

export const INTERSTATE_ZONES: { value: string; label: string; fee: number }[] = [
  { value: "northwest", label: "Northwest", fee: 7000 },
  { value: "northeast", label: "Northeast", fee: 7000 },
  { value: "northcentral", label: "North Central", fee: 7000 },
  { value: "southwest", label: "Southwest", fee: 7000 },
  { value: "southeast", label: "Southeast", fee: 7000 },
  { value: "southsouth", label: "South South", fee: 7000 },
  { value: "other", label: "Other (contact for fee)", fee: 0 },
];

interface ShippingMethodProps {
  selected: DeliveryOption;
  interstateZone: string;
  onChange: (value: DeliveryOption) => void;
  onInterstateZoneChange?: (value: string) => void;
}

const ShippingMethod = ({
  selected,
  interstateZone,
  onChange,
  onInterstateZoneChange,
}: ShippingMethodProps) => {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const interstateFee =
    selected === "interstate"
      ? INTERSTATE_ZONES.find((z) => z.value === interstateZone)?.fee ?? 7000
      : 0;

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Delivery option</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="store_pickup"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="store_pickup"
                className="sr-only"
                checked={selected === "store_pickup"}
                onChange={() => onChange("store_pickup")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selected === "store_pickup"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              />
            </div>
            <div className="rounded-md border border-gray-4 py-3.5 px-5 flex-1">
              <p className="font-semibold text-dark">Store pickup</p>
              <p className="text-custom-sm text-dark-4">No delivery fees</p>
            </div>
          </label>

          <label
            htmlFor="abuja"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="abuja"
                className="sr-only"
                checked={selected === "abuja"}
                onChange={() => onChange("abuja")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selected === "abuja" ? "border-4 border-blue" : "border border-gray-4"
                }`}
              />
            </div>
            <div className="rounded-md border border-gray-4 py-3.5 px-5 flex-1">
              <p className="font-semibold text-dark">
                Delivery within Abuja (weekdays)
              </p>
              <p className="text-custom-sm text-dark-4">
                ~{symbol}{formatPrice(toDisplayAmount(5000), currency)} · 24hrs max
              </p>
            </div>
          </label>

          <label
            htmlFor="interstate"
            className="flex cursor-pointer select-none items-start gap-3.5"
          >
            <div className="relative mt-1">
              <input
                type="radio"
                name="shippingMethod"
                id="interstate"
                className="sr-only"
                checked={selected === "interstate"}
                onChange={() => onChange("interstate")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selected === "interstate"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              />
            </div>
            <div className="rounded-md border border-gray-4 py-3.5 px-5 flex-1">
              <p className="font-semibold text-dark">
                Delivery Interstate (Saturdays)
              </p>
              <p className="text-custom-sm text-dark-4 mb-2">
                Each zone has its fees (e.g. Northwest {symbol}
                {formatPrice(toDisplayAmount(7000), currency)})
              </p>
              {selected === "interstate" && onInterstateZoneChange && (
                <select
                  value={interstateZone}
                  onChange={(e) => onInterstateZoneChange(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-3 bg-gray-1 text-dark py-2 px-3 text-custom-sm outline-none focus:ring-2 focus:ring-blue/20"
                  aria-label="Select zone"
                >
                  {INTERSTATE_ZONES.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                      {z.fee > 0 ? ` — ${symbol}${formatPrice(toDisplayAmount(z.fee), currency)}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
