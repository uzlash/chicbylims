"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

interface HeroCarouselProps {
  products?: Product[];
  brand?: string;
}

function discountPercent(price: number, comparePrice: number): number | null {
  if (comparePrice <= 0 || price >= comparePrice) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

const HeroCarousel = ({ products = [], brand }: HeroCarouselProps) => {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const hasProducts = products.length > 0;
  const brandPrefix = brand ? `/${brand}` : "";

  if (!hasProducts) {
    return null;
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {products.map((product, index) => {
          const discount = product.price > product.discountedPrice
            ? discountPercent(product.discountedPrice, product.price)
            : null;
          return (
            <SwiperSlide key={product.id ?? index}>
              <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
                <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
                  {product.productOfMonth && (
                    <span className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-orange/10 text-orange text-xs font-semibold uppercase tracking-wide">
                      Product of the Month
                    </span>
                  )}
                  {discount != null && (
                    <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                      <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                        {discount}%
                      </span>
                      <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                        Sale
                        <br />
                        Off
                      </span>
                    </div>
                  )}
                  <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                    <Link href={`${brandPrefix}/shop-details/${product.slug ?? "#"}`}>
                      {product.title}
                    </Link>
                  </h1>
                  <p className="text-dark-4 text-sm line-clamp-2 mb-4">
                    From {symbol}{formatPrice(toDisplayAmount(product.discountedPrice), currency)}
                    {product.price > product.discountedPrice && (
                      <span className="line-through ml-1">{symbol}{formatPrice(toDisplayAmount(product.price), currency)}</span>
                    )}
                  </p>
                  <Link
                    href={`${brandPrefix}/shop-details/${product.slug ?? "#"}`}
                    className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
                  >
                    Shop Now
                  </Link>
                </div>
                <div className="flex items-center justify-center min-h-[200px] sm:min-h-[358px]">
                  {product.imgs?.previews?.[0] ? (
                    <Image
                      src={product.imgs.previews[0]}
                      alt={product.title}
                      width={351}
                      height={358}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-[280px] h-[280px] sm:w-[351px] sm:h-[358px] bg-gray-2 rounded flex items-center justify-center text-gray-500">
                      No image
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default HeroCarousel;
