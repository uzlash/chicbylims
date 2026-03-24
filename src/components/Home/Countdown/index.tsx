"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

export interface CounDownProps {
  product?: Product | null;
  deadline?: string | null;
  brand?: string;
}

function CounDown({ product, deadline, brand }: CounDownProps) {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const deadlineStr = deadline || "December 31, 2025";
  const brandPrefix = brand ? `/${brand}` : "";

  const getTime = () => {
    const time = Date.parse(deadlineStr) - Date.now();
    if (time <= 0) {
      setDays(0);
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      return;
    }
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, [deadlineStr]);

  if (!product) return null;

  const img = product.imgs?.previews?.[0] ?? product.imgs?.thumbnails?.[0];

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15">
          <div className="max-w-[422px] w-full">
            <span className="block font-medium text-custom-1 text-blue mb-2.5">
              Don't Miss!!
            </span>
            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
              {product.title}
            </h2>
            <p className="text-dark">
              From {symbol}{formatPrice(toDisplayAmount(product.discountedPrice), currency)}
              {product.price > product.discountedPrice && (
                <span className="line-through ml-1">{symbol}{formatPrice(toDisplayAmount(product.price), currency)}</span>
              )}
            </p>

            <div className="flex flex-wrap gap-6 mt-6">
              <div>
                <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                  {days < 10 ? "0" + days : days}
                </span>
                <span className="block text-custom-sm text-dark text-center">Days</span>
              </div>
              <div>
                <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                  {hours < 10 ? "0" + hours : hours}
                </span>
                <span className="block text-custom-sm text-dark text-center">Hours</span>
              </div>
              <div>
                <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                  {minutes < 10 ? "0" + minutes : minutes}
                </span>
                <span className="block text-custom-sm text-dark text-center">Minutes</span>
              </div>
              <div>
                <span className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2">
                  {seconds < 10 ? "0" + seconds : seconds}
                </span>
                <span className="block text-custom-sm text-dark text-center">Seconds</span>
              </div>
            </div>

            <Link
              href={`${brandPrefix}/shop-details/${product.slug ?? "#"}`}
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Check it Out!
            </Link>
          </div>

          {img && (
            <Image
              src={img}
              alt={product.title}
              className="hidden lg:block absolute right-4 xl:right-33 bottom-4 xl:bottom-10 -z-1"
              width={411}
              height={376}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default CounDown;
