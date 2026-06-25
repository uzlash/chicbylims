"use client";

import React from "react";
import dynamic from "next/dynamic";
import NewArrival from "./NewArrivals";
import Featured from "./Featured";
import CollectionBand from "./CollectionBand";
import FeaturedShowcase from "./FeaturedShowcase";
import BrandStatement from "./BrandStatement";
import OurStory from "./OurStory";
import InstagramFeed from "./InstagramFeed";

const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div className="min-h-[78vh] animate-pulse bg-cream" />,
});
const Testimonials = dynamic(() => import("./Testimonials"), {
  ssr: false,
  loading: () => <div className="min-h-[280px] animate-pulse bg-cream" />,
});

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Testimonial } from "@/types/testimonial";

interface HomeProps {
  newArrivals: Product[];
  featured: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  heroCarousel?: Product[];
  heroSmallCard1?: Product | null;
  heroSmallCard2?: Product | null;
  promoBig?: Product | null;
  promoMedium1?: Product | null;
  promoMedium2?: Product | null;
  countdownProduct?: Product | null;
  countdownDeadline?: string | null;
  brand?: string;
}

const firstImage = (...products: (Product | null | undefined)[]) => {
  for (const p of products) {
    const src = p?.imgs?.previews?.[0];
    if (src) return src;
  }
  return null;
};

const Home = ({
  newArrivals,
  featured,
  testimonials,
  heroCarousel = [],
  heroSmallCard1 = null,
  promoBig = null,
  countdownProduct = null,
  brand,
}: HomeProps) => {
  const heroImage = firstImage(heroCarousel[0], featured[0], newArrivals[0]);
  const collectionImage = firstImage(promoBig, featured[1], newArrivals[1], newArrivals[0]);
  const showcaseProduct =
    countdownProduct || featured.find((p) => p.productOfMonth) || featured[0] || newArrivals[0] || null;
  const storyImage = firstImage(featured[2], newArrivals[2], heroSmallCard1, featured[0]);
  const instagramImages = [...newArrivals, ...featured]
    .map((p) => p?.imgs?.previews?.[0])
    .filter(Boolean) as string[];

  return (
    <main>
      <Hero carouselProducts={heroCarousel} smallCard1={heroSmallCard1} image={heroImage} brand={brand} />
      <CollectionBand image={collectionImage} ctaHref={brand ? `/${brand}/shop` : "/shop"} />
      <NewArrival products={newArrivals} brand={brand} />
      <FeaturedShowcase product={showcaseProduct} brand={brand} />
      <Featured products={featured} brand={brand} />
      <BrandStatement />
      <Testimonials testimonials={testimonials} />
      <OurStory image={storyImage} ctaHref={brand ? `/${brand}/contact` : "/contact"} />
      <InstagramFeed images={instagramImages} />
    </main>
  );
};

export default Home;
