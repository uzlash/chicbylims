"use client";
import React from "react";

import { Product } from "@/types/product";
import { useAddToCartModal } from "@/app/context/AddToCartModalContext";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { formatPrice } from "@/lib/formatPrice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/app/context/CurrencyContext";

const SingleListItem = ({ item, brand }: { item: Product; brand?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openWithProduct } = useAddToCartModal();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isWishlisted = wishlistItems.some((i) => i.id === item.id);
  const brandPrefix = brand ? `/${brand}` : "";
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const displayPrice = toDisplayAmount(item.discountedPrice ?? item.price);
  const displayCompare = toDisplayAmount(item.price);
  const hasDiscount = !!item.discountedPrice && item.discountedPrice < item.price;
  const detailsHref = `${brandPrefix}/shop-details/${item.slug || "#"}`;

  const handleItemToWishList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeItemFromWishlist(item.id));
    } else {
      dispatch(addItemToWishlist({ ...item, status: "available", quantity: 1 }));
    }
  };

  return (
    <div className="group flex flex-col gap-5 border border-cream-dark bg-white p-4 sm:flex-row sm:items-center sm:gap-7">
      <Link
        href={detailsHref}
        className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-cream sm:h-[220px] sm:w-[180px]"
      >
        {item.imgs?.previews?.[0] ? (
          <Image
            src={item.imgs.previews[0]}
            alt={item.title || "Product image"}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-custom-sm text-dark-4">
            No image
          </div>
        )}
        {item.productOfMonth && (
          <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.12em] text-white">
            Product of the month
          </span>
        )}
      </Link>

      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:pr-4">
        <div>
          <h3 className="mb-2">
            <Link
              href={detailsHref}
              className="text-custom-lg font-medium text-dark transition-colors duration-200 hover:text-blue"
            >
              {item.title}
            </Link>
          </h3>
          <span className="flex items-center gap-2 text-custom-lg font-medium">
            <span className="text-dark">
              {symbol}
              {formatPrice(displayPrice, currency)}
            </span>
            {hasDiscount && (
              <span className="text-dark-4 line-through">
                {symbol}
                {formatPrice(displayCompare, currency)}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => openWithProduct(item)} className="btn-primary">
            Add to cart
          </button>
          <button
            type="button"
            onClick={handleItemToWishList}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`flex h-11 w-11 shrink-0 items-center justify-center border transition-colors duration-200 ${
              isWishlisted
                ? "border-blue bg-blue text-white"
                : "border-cream-dark text-dark hover:border-dark hover:text-blue"
            }`}
          >
            <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <path d="M7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;
