"use client";

import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

interface HeroProps {
  carouselProducts?: Product[];
  smallCard1?: Product | null;
  smallCard2?: Product | null;
  brand?: string;
}

const Hero = ({ carouselProducts = [], smallCard1 = null, smallCard2 = null, brand }: HeroProps) => {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const brandPrefix = brand ? `/${brand}` : "";

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-[132px] xl:pt-[140px] bg-[#F4E9F1]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />
              <HeroCarousel products={carouselProducts} brand={brand} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {smallCard1 && (
                <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                        <Link href={`${brandPrefix}/shop-details/${smallCard1.slug || "#"}`}>
                          {smallCard1.title}
                        </Link>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                          limited time offer
                        </p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-md text-red">
                            {symbol}{formatPrice(toDisplayAmount(smallCard1.discountedPrice), currency)}
                          </span>
                          {smallCard1.price > smallCard1.discountedPrice && (
                            <span className="font-medium text-sm text-dark-4 line-through">
                              {symbol}{formatPrice(toDisplayAmount(smallCard1.price), currency)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      {smallCard1.imgs?.previews?.[0] ? (
                        <Image
                          src={smallCard1.imgs.previews[0]}
                          alt={smallCard1.title}
                          width={123}
                          height={161}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-[123px] h-[161px] bg-gray-2 rounded flex items-center justify-center text-gray-500 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {smallCard2 && (
                <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                        <Link href={`${brandPrefix}/shop-details/${smallCard2.slug || "#"}`}>
                          {smallCard2.title}
                        </Link>
                      </h2>
                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                          limited time offer
                        </p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-md text-red">
                            {symbol}{formatPrice(toDisplayAmount(smallCard2.discountedPrice), currency)}
                          </span>
                          {smallCard2.price > smallCard2.discountedPrice && (
                            <span className="font-medium text-sm text-dark-4 line-through">
                              {symbol}{formatPrice(toDisplayAmount(smallCard2.price), currency)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      {smallCard2.imgs?.previews?.[0] ? (
                        <Image
                          src={smallCard2.imgs.previews[0]}
                          alt={smallCard2.title}
                          width={123}
                          height={161}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-[123px] h-[161px] bg-gray-2 rounded flex items-center justify-center text-gray-500 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <HeroFeature />
    </section>
  );
};

export default Hero;
