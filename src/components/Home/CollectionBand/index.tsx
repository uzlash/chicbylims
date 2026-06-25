import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CollectionBandProps {
  image?: string | null;
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const CollectionBand = ({
  image,
  eyebrow = "Just landed",
  title = "New Summer Collection",
  text = "Vibrant prints and breezy silhouettes, made for sunshine and unforgettable escapes.",
  ctaLabel = "Shop now",
  ctaHref = "/shop",
}: CollectionBandProps) => {
  return (
    <section className="pt-20 xl:pt-28">
      <div className="section-container">
        <div className="relative flex min-h-[420px] items-center overflow-hidden bg-forest sm:min-h-[480px]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center opacity-60"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/45 to-transparent" />

          <div className="relative z-1 max-w-[560px] px-6 py-14 sm:px-12 xl:px-16">
            <span className="eyebrow text-white/85">{eyebrow}</span>
            <h2 className="heading-serif mt-3 text-display-2 text-white">{title}</h2>
            <p className="mt-4 max-w-[420px] text-custom-lg leading-relaxed text-white/90">{text}</p>
            <Link href={ctaHref} className="btn-gold mt-8">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionBand;
