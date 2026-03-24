"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useAddToCartModal } from "@/app/context/AddToCartModalContext";
import { useBrand } from "@/app/context/BrandContext";
import { addItemToCart, type CartItem } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { selectCartItems } from "@/redux/features/cart-slice";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

/** Same variant = same id/slug + same color + same size (matches cart-slice sameProduct). */
function cartQtyForVariant(cartItems: CartItem[], product: { id?: string | number; slug?: string; color?: string; size?: string }): number {
  const id = product.id ?? product.slug;
  if (id == null) return 0;
  const item = cartItems.find(
    (i) => (i.slug ? i.slug === product.slug : i.id === id) && (i.color ?? "") === (product.color ?? "") && (i.size ?? "") === (product.size ?? "")
  );
  return item?.quantity ?? 0;
}

const AddToCartModal = () => {
  const { isOpen, product, close } = useAddToCartModal();
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector(selectCartItems);
  const brandSlug = "fabrics";

  // Color+size (Kinder-style)
  const [activeColorKey, setActiveColorKey] = useState(0);
  const [activeSize, setActiveSize] = useState("");

  // Size-variant pricing (HEIM-style)
  const [activeSizeVariantIdx, setActiveSizeVariantIdx] = useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  // Determine product mode
  const hasSizeVariants = (product?.sizeVariants?.length ?? 0) > 0;
  const variantsWithColor = product?.colorVariants?.filter((v) => v?.color) ?? [];
  const colorOptions = variantsWithColor.map((v) => v.color);
  const availableSizes = variantsWithColor[activeColorKey]?.sizes ?? [];
  const selectedColorName = colorOptions[activeColorKey]?.name ?? undefined;

  // Resolved display price (changes when user picks a size variant)
  const activeSizeVariant =
    hasSizeVariants && activeSizeVariantIdx !== null
      ? product!.sizeVariants![activeSizeVariantIdx]
      : null;
  const displayPrice = activeSizeVariant?.price ?? product?.discountedPrice ?? 0;

  // Effective max quantity: product stock minus what's already in cart for this variant
  const payloadForCart = useMemo(() => {
    if (!product) return null;
    if (hasSizeVariants && activeSizeVariantIdx !== null) {
      return { ...product, quantity: 1, size: product.sizeVariants![activeSizeVariantIdx].label, color: undefined as string | undefined };
    }
    return { ...product, quantity: 1, color: selectedColorName, size: activeSize || undefined };
  }, [product, hasSizeVariants, activeSizeVariantIdx, selectedColorName, activeSize]);

  const cartQty = payloadForCart ? cartQtyForVariant(cartItems, payloadForCart) : 0;
  const productStock = typeof product?.stock === "number" ? product.stock : null;
  const maxQuantity = productStock != null ? Math.max(0, productStock - cartQty) : null;

  useEffect(() => {
    if (isOpen) {
      setActiveColorKey(0);
      setActiveSize("");
      setActiveSizeVariantIdx(null);
      setQuantity(1);
    }
  }, [isOpen, product?.id]);

  // Clamp quantity to available stock when product, cart, or variant selection changes
  useEffect(() => {
    if (maxQuantity != null && quantity > maxQuantity) setQuantity(maxQuantity);
  }, [maxQuantity, quantity]);

  const handleAddToCart = () => {
    if (!product) return;
    if (hasSizeVariants) {
      dispatch(
        addItemToCart({
          ...product,
          price: activeSizeVariant!.price,
          discountedPrice: activeSizeVariant!.price,
          quantity,
          size: activeSizeVariant!.label,
          color: undefined,
          brandSlug,
        })
      );
    } else {
      dispatch(
        addItemToCart({
          ...product,
          quantity,
          color: selectedColorName,
          size: activeSize || undefined,
          brandSlug,
        })
      );
    }
    close();
  };

  const hasColorOptions = colorOptions.length > 0;
  const needsSize = availableSizes.length > 0;
  const canAdd =
    (hasSizeVariants ? activeSizeVariantIdx !== null : !needsSize || activeSize.length > 0) &&
    (maxQuantity === null || maxQuantity > 0);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-dark/60"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-5">
          <div className="flex gap-4 flex-1 min-w-0">
            {product.imgs?.previews?.[0] && (
              <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-1">
                <Image
                  src={product.imgs.previews[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-dark truncate">{product.title}</h3>
              <p className="text-lg font-medium text-dark mt-1">
                {symbol}{formatPrice(toDisplayAmount(displayPrice), currency)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-dark-4 hover:bg-gray-2 hover:text-dark"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* HEIM-style: size variants with individual prices */}
        {hasSizeVariants ? (
          <div className="mb-4">
            <p className="text-custom-sm font-medium text-dark-4 mb-3">
              Choose a size/variant before adding to cart
            </p>
            <div className="flex flex-col gap-2">
              {product.sizeVariants!.map((sv, idx) => (
                <label
                  key={idx}
                  className={`cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-colors ${
                    activeSizeVariantIdx === idx
                      ? "border-blue bg-blue/5"
                      : "border-gray-3 hover:border-gray-4"
                  }`}
                >
                  <input
                    type="radio"
                    name="modal-size-variant"
                    className="sr-only"
                    checked={activeSizeVariantIdx === idx}
                    onChange={() => setActiveSizeVariantIdx(idx)}
                  />
                  <span className="text-sm font-medium text-dark">{sv.label}</span>
                  <span className="text-sm font-semibold text-blue">
                    {symbol}{formatPrice(toDisplayAmount(sv.price), currency)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : hasColorOptions ? (
          <>
            <p className="text-custom-sm font-medium text-dark-4 mb-3">
              Choose color and size before adding to cart
            </p>
            {/* Color picker */}
            <div className="mb-4">
              <label className="block text-custom-sm font-medium text-dark mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, key) => (
                  <label
                    key={key}
                    className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-colors ${
                      activeColorKey === key ? "border-blue bg-blue/5" : "border-gray-3 hover:border-gray-4"
                    }`}
                  >
                    <input
                      type="radio"
                      name="modal-color"
                      className="sr-only"
                      checked={activeColorKey === key}
                      onChange={() => {
                        setActiveColorKey(key);
                        setActiveSize("");
                      }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-gray-3 flex-shrink-0"
                      style={{ backgroundColor: color?.value ?? "#eee" }}
                    />
                    <span className="text-custom-sm text-dark">{color?.name ?? "—"}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size picker */}
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-custom-sm font-medium text-dark mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <label
                      key={size}
                      className={`cursor-pointer px-3 py-1.5 rounded-md border-2 text-custom-sm font-medium transition-colors ${
                        activeSize === size ? "border-blue bg-blue text-white" : "border-gray-3 hover:border-gray-4 text-dark"
                      }`}
                    >
                      <input
                        type="radio"
                        name="modal-size"
                        className="sr-only"
                        checked={activeSize === size}
                        onChange={() => setActiveSize(size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-custom-sm text-dark-4 mb-4">No options for this product.</p>
        )}

        {/* Quantity */}
        <div className="mb-5">
          <label className="block text-custom-sm font-medium text-dark mb-2">Quantity</label>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 rounded-md border border-gray-3 flex items-center justify-center text-dark hover:bg-gray-2"
              >
                −
              </button>
              <span className="w-12 text-center font-medium text-dark">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => (maxQuantity != null ? Math.min(maxQuantity, q + 1) : q + 1))}
                aria-label="Increase quantity"
                disabled={maxQuantity != null && quantity >= maxQuantity}
                className="w-9 h-9 rounded-md border border-gray-3 flex items-center justify-center text-dark hover:bg-gray-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            {maxQuantity != null && (
              <p className="text-custom-sm text-dark-4 w-full">
                {maxQuantity === 0 ? "Out of stock" : `Max ${maxQuantity} available${cartQty > 0 ? ` (${cartQty} in cart)` : ""}`}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="w-full py-3 px-4 rounded-md font-medium text-white bg-blue hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {!canAdd
            ? hasSizeVariants
              ? "Choose a size/variant above"
              : "Choose a size/variant"
            : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
