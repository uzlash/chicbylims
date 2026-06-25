"use client";
import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useAddToCartModal } from "@/app/context/AddToCartModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { formatPrice } from "@/lib/formatPrice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useCurrency } from "@/app/context/CurrencyContext";

const Stars = ({ rating = 5 }: { rating?: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="12"
        height="12"
        viewBox="0 0 24 24"
        className={i < Math.round(rating) ? "fill-gold" : "fill-gray-4"}
        aria-hidden
      >
        <path d="M12 2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.98 6.09 20.16l1.13-6.57L2.45 8.94l6.6-.96L12 2z" />
      </svg>
    ))}
  </span>
);

const ProductItem = ({
  item,
  brand,
  disableQuickView = false,
  badge,
  rating = 5,
}: {
  item: Product;
  brand?: string;
  disableQuickView?: boolean;
  badge?: string;
  rating?: number;
}) => {
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const displayDiscounted = toDisplayAmount(item.discountedPrice ?? item.price);
  const displayCompare = toDisplayAmount(item.price);
  const hasDiscount = !!item.discountedPrice && item.discountedPrice < item.price;
  const discountPct = hasDiscount
    ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
    : 0;

  const { openModal } = useModalContext();
  const { openWithProduct } = useAddToCartModal();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isWishlisted = wishlistItems.some((i) => i.id === item.id);
  const brandPrefix = brand ? `/${brand}` : "";
  const detailsHref = `${brandPrefix}/shop-details/${item.slug || "#"}`;

  const handleAddToCart = () => openWithProduct(item);
  const handleItemToWishList = () => {
    if (isWishlisted) {
      dispatch(removeItemFromWishlist(item.id));
    } else {
      dispatch(addItemToWishlist({ ...item, status: "available", quantity: 1 }));
    }
  };

  return (
    <div className="group">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-cream">
        <Link
          href={detailsHref}
          onClick={() => dispatch(updateproductDetails({ ...item }))}
          aria-label={item.title}
          className="block h-full w-full"
        >
          {item.imgs?.previews?.[0] ? (
            <Image
              src={item.imgs.previews[0]}
              alt={item.title || "Product image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-custom-sm text-dark-4">
              No image
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {badge && (
            <span className="bg-ink px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.12em] text-white">
              {badge}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-blue px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.12em] text-white">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleItemToWishList}
          aria-label="Add to wishlist"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-1 transition-colors duration-200 ${
            isWishlisted ? "bg-blue text-white" : "bg-white text-dark hover:text-blue"
          }`}
        >
          <svg className="fill-current" width="15" height="15" viewBox="0 0 16 16" aria-hidden>
            <path d="M7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z" />
          </svg>
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center gap-2 px-3 pb-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <button onClick={handleAddToCart} className="btn-primary flex-1 px-3 py-2.5 text-2xs">
            Add to cart
          </button>
          {disableQuickView ? (
            <Link
              href={detailsHref}
              aria-label="View details"
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-dark shadow-1 transition-colors hover:text-blue"
            >
              <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path fillRule="evenodd" clipRule="evenodd" d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666Z" />
              </svg>
            </Link>
          ) : (
            <button
              onClick={() => {
                openModal();
                dispatch(updateQuickView({ ...item }));
              }}
              aria-label="Quick view"
              className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-dark shadow-1 transition-colors hover:text-blue"
            >
              <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path fillRule="evenodd" clipRule="evenodd" d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="text-center">
        <Stars rating={rating} />
        <h3 className="mt-1.5">
          <Link
            href={detailsHref}
            onClick={() => dispatch(updateproductDetails({ ...item }))}
            className="text-custom-sm font-medium text-dark transition-colors duration-200 hover:text-blue"
          >
            {item.title}
          </Link>
        </h3>
        <span className="mt-1 flex items-center justify-center gap-2 text-custom-sm font-medium">
          <span className="text-dark">
            {symbol}
            {formatPrice(displayDiscounted, currency)}
          </span>
          {hasDiscount && (
            <span className="text-dark-4 line-through">
              {symbol}
              {formatPrice(displayCompare, currency)}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ProductItem;
