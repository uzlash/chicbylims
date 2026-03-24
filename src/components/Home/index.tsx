"use client";

import React from "react";
import dynamic from "next/dynamic";
import NewArrival from "./NewArrivals";
import Featured from "./Featured";
import PromoBanner from "./PromoBanner";
import CounDown from "./Countdown";
import Newsletter from "../Common/Newsletter";

const Hero = dynamic(() => import("./Hero"), { ssr: false, loading: () => <div className="min-h-[400px] bg-gray-1 animate-pulse" /> });
const Categories = dynamic(() => import("./Categories"), { ssr: false, loading: () => <div className="min-h-[200px] bg-gray-1 animate-pulse" /> });
const Testimonials = dynamic(() => import("./Testimonials"), { ssr: false, loading: () => <div className="min-h-[280px] bg-gray-1 animate-pulse" /> });
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

const Home = ({ newArrivals, featured, categories, testimonials, heroCarousel = [], heroSmallCard1 = null, heroSmallCard2 = null, promoBig = null, promoMedium1 = null, promoMedium2 = null, countdownProduct = null, countdownDeadline = null, brand }: HomeProps) => {
  return (
    <main>
      <Hero
        carouselProducts={heroCarousel}
        smallCard1={heroSmallCard1}
        smallCard2={heroSmallCard2}
        brand={brand}
      />
      <Categories categories={categories} brand={brand} />
      <Featured products={featured} brand={brand} />
      <NewArrival products={newArrivals} brand={brand} />
      <PromoBanner
        bigCard={promoBig}
        mediumCard1={promoMedium1}
        mediumCard2={promoMedium2}
        brand={brand}
      />
      <CounDown
        product={countdownProduct}
        deadline={countdownDeadline}
        brand={brand}
      />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </main>
  );
};

export default Home;
