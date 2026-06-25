import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  image?: string | null;
  heading?: string;
  body?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_BODY = [
  "Chibylims was born from a love of authentic African design and a mission to bring bold, contemporary, ready-to-wear fashion to women everywhere.",
  "We blend traditional prints with modern silhouettes — every piece tells a story of heritage, confidence and effortless style.",
];

const OurStory = ({
  image,
  heading = "Our Story",
  body = DEFAULT_BODY,
  ctaLabel = "Read more",
  ctaHref = "/contact",
}: Props) => {
  return (
    <section className="full-bleed mt-20 bg-ink xl:mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Text */}
        <div className="flex items-center px-6 py-16 sm:px-12 lg:px-16 xl:py-24">
          <div className="ml-auto max-w-[560px]">
            <span className="eyebrow text-white/60">The brand</span>
            <h2 className="heading-serif mt-3 text-display-2 text-white">{heading}</h2>
            <div className="mt-6 space-y-4">
              {body.map((p, i) => (
                <p key={i} className="text-custom-lg leading-relaxed text-white/75">
                  {p}
                </p>
              ))}
            </div>
            <Link href={ctaHref} className="btn-outline-light mt-8">
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[360px] bg-ink-soft lg:min-h-[560px]">
          {image ? (
            <Image src={image} alt={heading} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default OurStory;
