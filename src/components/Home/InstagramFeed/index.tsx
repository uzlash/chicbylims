import React from "react";
import Image from "next/image";

interface Props {
  images?: string[];
  handle?: string;
  href?: string;
}

const InstagramFeed = ({
  images = [],
  handle = "@chicbylims",
  href = "https://instagram.com",
}: Props) => {
  const tiles = images.filter(Boolean).slice(0, 6);
  if (!tiles.length) return null;

  return (
    <section className="pt-20 xl:pt-28">
      <div className="section-container">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="eyebrow text-forest">Join the fun</span>
          <h2 className="heading-serif mt-3 text-display-3">Follow us on Instagram</h2>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-custom-sm font-medium text-dark transition-colors hover:text-blue"
          >
            {handle}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((src, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-cream"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/20" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
