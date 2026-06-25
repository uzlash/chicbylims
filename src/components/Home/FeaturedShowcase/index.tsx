"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatPrice } from "@/lib/formatPrice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

interface Props {
  product?: Product | null;
  brand?: string;
}

const FeaturedShowcase = ({ product, brand }: Props) => {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal } = useCartModalContext();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const brandPrefix = brand ? `/${brand}` : "";
  const detailsHref = `${brandPrefix}/shop-details/${product.slug || "#"}`;
  const hasDiscount = !!product.discountedPrice && product.discountedPrice < product.price;
  const priceNow = toDisplayAmount(product.discountedPrice ?? product.price);
  const priceWas = toDisplayAmount(product.price);
  const hasVariants =
    (product.colorVariants?.length ?? 0) > 0 || (product.sizeVariants?.length ?? 0) > 0;

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        discountedPrice: product.discountedPrice ?? product.price,
        quantity,
        imgs: product.imgs,
        stock: product.stock,
        productOfMonth: product.productOfMonth,
        brandSlug: brand,
      })
    );
    openCartModal();
  };

  return (
    <section className="pt-20 xl:pt-28">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-cream">
            {product.imgs?.previews?.[0] ? (
              <Image
                src={product.imgs.previews[0]}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : null}
            {product.productOfMonth && (
              <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-2xs font-medium uppercase tracking-[0.14em] text-white">
                Product of the month
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="eyebrow text-forest">Featured piece</span>
            <h2 className="heading-serif mt-3 text-display-3">{product.title}</h2>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-custom-2xl font-medium text-dark">
                {symbol}
                {formatPrice(priceNow, currency)}
              </span>
              {hasDiscount && (
                <span className="text-custom-lg text-dark-4 line-through">
                  {symbol}
                  {formatPrice(priceWas, currency)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-5 max-w-[460px] text-custom-sm leading-relaxed text-body line-clamp-4">
                {product.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-cream-dark">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-12 items-center justify-center text-dark transition-colors hover:text-blue"
                >
                  −
                </button>
                <span className="flex h-12 w-12 items-center justify-center text-custom-sm font-medium text-dark">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-12 w-12 items-center justify-center text-dark transition-colors hover:text-blue"
                >
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-primary flex-1 sm:flex-none">
                Add to cart
              </button>
            </div>

            <Link
              href={detailsHref}
              className="mt-4 inline-block text-custom-sm text-dark underline-offset-4 transition-colors hover:text-blue hover:underline"
            >
              {hasVariants ? "View details for sizes & colours" : "View full details"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShowcase;
