"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface HeroProps {
  carouselProducts?: Product[];
  smallCard1?: Product | null;
  smallCard2?: Product | null;
  brand?: string;
  eyebrow?: string;
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string | null;
}

const Hero = ({
  carouselProducts = [],
  smallCard1 = null,
  brand,
  eyebrow = "New Summer Collection",
  headline = "Holiday Ready",
  subtext = "Bold prints made for sunshine, pools, moments and unforgettable escapes.",
  ctaLabel = "Shop the collection",
  ctaHref,
  image,
}: HeroProps) => {
  const brandPrefix = brand ? `/${brand}` : "";
  const heroImage =
    image ||
    carouselProducts?.[0]?.imgs?.previews?.[0] ||
    smallCard1?.imgs?.previews?.[0] ||
    null;
  const href = ctaHref || `${brandPrefix}/shop`;

  return (
    <section className="full-bleed relative">
      <div className="relative flex min-h-[78vh] items-end overflow-hidden bg-cream-dark sm:min-h-[82vh]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={headline}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : null}

        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        <div className="section-container relative z-1 pb-16 pt-28 sm:pb-20 xl:pb-28">
          <div className="max-w-[640px]">
            <span className="eyebrow text-white/85">{eyebrow}</span>
            <h1 className="heading-serif mt-3 text-display-1 text-white">{headline}</h1>
            <p className="mt-4 max-w-[460px] text-custom-lg leading-relaxed text-white/90">
              {subtext}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={href} className="btn-gold">
                {ctaLabel}
              </Link>
              <Link href={`${brandPrefix}/shop`} className="btn-outline-light">
                Shop all
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
