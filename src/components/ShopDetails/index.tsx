"use client";
import React, { useEffect, useState, useMemo } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useBrand } from "@/app/context/BrandContext";
import { useAppSelector } from "@/redux/store";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart-slice";
import { selectCartItems } from "@/redux/features/cart-slice";
import type { CartItem } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

interface ShopDetailsProps {
  product?: Product;
  /** WhatsApp/contact number from site settings (brand). Used for "Order via WhatsApp" when set. */
  siteContactPhone?: string | null;
}

const DEFAULT_DELIVERY = "24 hrs max within Abuja. Saturdays for interstate deliveries.";

function cartQtyForVariant(cartItems: CartItem[], product: { id?: string | number; slug?: string; color?: string; size?: string }): number {
  const id = product.id ?? product.slug;
  if (id == null) return 0;
  const item = cartItems.find(
    (i) => (i.slug ? i.slug === product.slug : i.id === id) && (i.color ?? "") === (product.color ?? "") && (i.size ?? "") === (product.size ?? "")
  );
  return item?.quantity ?? 0;
}

const ShopDetails = ({ product: initialProduct, siteContactPhone }: ShopDetailsProps) => {
  const { openPreviewModal } = usePreviewSlider();
  const { brand } = useBrand();
  const { toDisplayAmount, symbol, currency } = useCurrency();
  const cartItems = useAppSelector(selectCartItems);
  const [previewImg, setPreviewImg] = useState(0);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("tabOne");

  const [activeColorKey, setActiveColorKey] = useState(0);
  const [activeSize, setActiveSize] = useState("");

  // HEIM-style: size variant with individual price
  const [activeSizeVariantIdx, setActiveSizeVariantIdx] = useState<number | null>(null);

  // Fallback to Redux/LocalStorage if no product prop is provided (backward compatibility)
  const alreadyExist = typeof window !== 'undefined' ? localStorage.getItem("productDetails") : null;
  const productFromStorage = useAppSelector(
    (state) => state.productDetailsReducer.value
  );

  const product = initialProduct || (alreadyExist ? JSON.parse(alreadyExist) : productFromStorage);

  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);
  const isWishlisted = product ? wishlistItems.some((i) => i.id === product.id) : false;

  // Only use variants with a resolved color (guard against null refs)
  const variantsWithColor = product?.colorVariants?.filter((v) => v?.color) ?? [];
  const colorOptions = variantsWithColor.map((v) => v.color);
  const availableSizes = variantsWithColor[activeColorKey]?.sizes ?? [];

  const hasSizeVariants = (product?.sizeVariants?.length ?? 0) > 0;
  const activeSizeVariant =
    hasSizeVariants && activeSizeVariantIdx !== null
      ? product!.sizeVariants![activeSizeVariantIdx]
      : null;
  const selectedColorName = colorOptions[activeColorKey]?.name ?? undefined;

  // Cart-aware max quantity (same as AddToCartModal / QuickViewModal)
  const payloadForCart = useMemo(() => {
    if (!product) return null;
    if (hasSizeVariants && activeSizeVariantIdx !== null) {
      return { ...product, quantity: 1, size: product.sizeVariants![activeSizeVariantIdx].label, color: undefined as string | undefined };
    }
    return { ...product, quantity: 1, color: selectedColorName, size: activeSize || undefined };
  }, [product, hasSizeVariants, activeSizeVariantIdx, selectedColorName, activeSize]);

  const cartQty = payloadForCart ? cartQtyForVariant(cartItems, payloadForCart) : 0;
  const rawStock = product?.stock as unknown as number | string | null | undefined;
  const parsedStock =
    rawStock === null || rawStock === undefined ? null : Number(rawStock);
  const productStock =
    parsedStock !== null && Number.isFinite(parsedStock) ? parsedStock : null;
  const maxQuantity = productStock != null ? Math.max(0, productStock - cartQty) : null;
  const atMax = maxQuantity != null ? quantity >= maxQuantity : false;

  // Effective price for display and WhatsApp message
  const effectivePrice = activeSizeVariant?.price ?? product?.discountedPrice ?? 0;
  const effectiveComparePrice = activeSizeVariant?.comparePrice ?? product?.price ?? 0;

  const deliveryText = product?.deliveryInfo ?? DEFAULT_DELIVERY;
  const whatsappNumber = siteContactPhone?.trim();
  const phoneDigits = whatsappNumber?.replace(/\D/g, "") ?? "";
  const lineTotal = effectivePrice * quantity;
  const orderMessage = product
    ? `Hello! I'd like to order:\n${product.title}${activeSizeVariant ? ` (${activeSizeVariant.label})` : ""} x${quantity} — ${symbol}${formatPrice(toDisplayAmount(lineTotal), currency)}\n\nTotal: ${symbol}${formatPrice(toDisplayAmount(lineTotal), currency)}`
    : "";
  const whatsappLink =
    phoneDigits && orderMessage
      ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(orderMessage)}`
      : null;

  useEffect(() => {
    if (product) {
      if (!initialProduct) {
        localStorage.setItem("productDetails", JSON.stringify(product));
      }
      dispatch(updateproductDetails(product));
    }
  }, [product, initialProduct, dispatch]);

  // Clamp quantity to available stock (cart-aware) when product, cart, or selection changes
  useEffect(() => {
    if (maxQuantity != null && quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [maxQuantity, quantity]);

  const handleAddToCart = () => {
    if (!product) return;
    if (maxQuantity != null && maxQuantity <= 0) return;
    if (hasSizeVariants) {
      dispatch(
        addItemToCart({
          ...product,
          price: activeSizeVariant!.price,
          discountedPrice: activeSizeVariant!.price,
          quantity,
          size: activeSizeVariant!.label,
          color: undefined,
          brandSlug: brand ?? undefined,
        })
      );
    } else {
      dispatch(
        addItemToCart({
          ...product,
          quantity,
          color: selectedColorName,
          size: activeSize || undefined,
          brandSlug: brand ?? undefined,
        })
      );
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    if (isWishlisted) {
      dispatch(removeItemFromWishlist(product.id));
    } else {
      dispatch(
        addItemToWishlist({
          ...product,
          status: "available",
          quantity: 1,
        })
      );
    }
  };

  const tabs = [
    { id: "tabOne", title: "Description" },
    { id: "tabTwo", title: "Shipping & Returns" },
  ];

  const handlePreviewSlider = () => {
    if (!product) return;
    const images = product.imgs?.previews?.length ? product.imgs.previews : (product.imgs?.thumbnails ?? []);
    openPreviewModal({ images, initialIndex: previewImg, productTitle: product.title });
  };

  const addDisabled =
    (maxQuantity != null && maxQuantity <= 0) ||
    (hasSizeVariants && activeSizeVariantIdx === null);

  if (!product || !product.title) {
    return (
      <>
        <Breadcrumb title={"Shop Details"} pages={["shop details"]} />
        <div className="section-container py-20 text-center">
          <p className="text-body">Product not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={product.title} pages={["shop", "details"]} />

      <section className="pt-12 xl:pt-16">
        <div className="section-container">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            {/* Gallery */}
            <div className="w-full lg:max-w-[560px]">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream">
                <button
                  onClick={handlePreviewSlider}
                  aria-label="Zoom product image"
                  title="Zoom product image"
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white text-dark shadow-1 transition-colors duration-200 hover:text-blue"
                >
                  <svg className="fill-current" width="20" height="20" viewBox="0 0 22 22" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                    />
                  </svg>
                </button>

                {product.imgs?.previews?.[previewImg] ? (
                  <Image
                    src={product.imgs.previews[previewImg]}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-custom-sm text-dark-4">
                    No image
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.imgs?.thumbnails?.length ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {product.imgs.thumbnails.map((item, key) => (
                    <button
                      aria-label="Preview image"
                      onClick={() => setPreviewImg(key)}
                      key={key}
                      className={`relative h-20 w-16 overflow-hidden bg-cream transition-colors duration-200 sm:h-24 sm:w-20 ${
                        key === previewImg ? "ring-2 ring-ink" : "ring-1 ring-cream-dark hover:ring-dark"
                      }`}
                    >
                      <Image src={item} alt="thumbnail" fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Product content */}
            <div className="w-full lg:max-w-[520px]">
              <div className="mb-3 flex items-start justify-between gap-4">
                <h1 className="heading-serif text-display-3">{product.title}</h1>
                {product.price > product.discountedPrice && (
                  <span className="mt-1 shrink-0 bg-blue px-2.5 py-1 text-2xs font-medium uppercase tracking-[0.12em] text-white">
                    Sale
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mb-5 flex items-center gap-1.5 text-custom-sm">
                {maxQuantity != null && maxQuantity === 0 ? (
                  <span className="text-red">Out of stock</span>
                ) : (
                  <span className="text-forest">In stock — ready to ship</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-custom-2xl font-medium text-dark">
                  {symbol}
                  {formatPrice(toDisplayAmount(effectivePrice), currency)}
                </span>
                {effectiveComparePrice > effectivePrice && (
                  <span className="text-custom-lg text-dark-4 line-through">
                    {symbol}
                    {formatPrice(toDisplayAmount(effectiveComparePrice), currency)}
                  </span>
                )}
              </div>

              <p className="mb-4 text-custom-sm text-body">
                <span className="font-medium text-dark">Delivery:</span> {deliveryText}
              </p>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 inline-flex items-center gap-2 text-custom-sm font-medium text-forest hover:underline"
                  title="Order via WhatsApp"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.387.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order via WhatsApp
                </a>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="my-8 flex flex-col gap-5 border-y border-cream-dark py-8">
                  {hasSizeVariants ? (
                    <div>
                      <h4 className="mb-3 text-custom-xs font-medium uppercase tracking-[0.12em] text-dark">
                        Select size / variant
                      </h4>
                      <div className="flex flex-col gap-2">
                        {product.sizeVariants!.map((sv, idx) => (
                          <label
                            key={idx}
                            htmlFor={`sv-${idx}`}
                            className={`flex cursor-pointer items-center justify-between border px-4 py-3 transition-colors ${
                              activeSizeVariantIdx === idx
                                ? "border-ink bg-cream"
                                : "border-cream-dark hover:border-dark"
                            }`}
                          >
                            <input
                              type="radio"
                              name="size-variant"
                              id={`sv-${idx}`}
                              className="sr-only"
                              checked={activeSizeVariantIdx === idx}
                              onChange={() => setActiveSizeVariantIdx(idx)}
                            />
                            <span className="text-custom-sm font-medium text-dark">{sv.label}</span>
                            <span className="text-custom-sm font-semibold text-dark">
                              {symbol}
                              {formatPrice(toDisplayAmount(sv.price), currency)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {colorOptions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4">
                          <h4 className="min-w-[60px] text-custom-xs font-medium uppercase tracking-[0.12em] text-dark">
                            Colour
                          </h4>
                          <div className="flex flex-wrap items-center gap-2.5">
                            {colorOptions.map((color, key) => (
                              <label
                                key={key}
                                htmlFor={`color-${key}`}
                                className="flex cursor-pointer select-none items-center gap-1.5"
                              >
                                <input
                                  type="radio"
                                  name="color"
                                  id={`color-${key}`}
                                  className="sr-only"
                                  checked={activeColorKey === key}
                                  onChange={() => {
                                    setActiveColorKey(key);
                                    setActiveSize("");
                                  }}
                                />
                                <span
                                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                    activeColorKey === key ? "border-ink" : "border-cream-dark"
                                  }`}
                                  style={{ backgroundColor: color?.value ?? "#eee" }}
                                  title={color?.name}
                                />
                                <span className="text-custom-sm text-dark">{color?.name ?? "—"}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {availableSizes.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4">
                          <h4 className="min-w-[60px] text-custom-xs font-medium uppercase tracking-[0.12em] text-dark">
                            Size
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            {availableSizes.map((size) => (
                              <label key={size} htmlFor={`size-${size}`} className="flex cursor-pointer select-none items-center">
                                <input
                                  type="radio"
                                  name="size"
                                  id={`size-${size}`}
                                  className="sr-only"
                                  checked={activeSize === size}
                                  onChange={() => setActiveSize(size)}
                                />
                                <span
                                  className={`inline-flex min-w-[2.75rem] items-center justify-center border px-3 py-2 text-custom-sm font-medium transition-colors ${
                                    activeSize === size
                                      ? "border-ink bg-ink text-white"
                                      : "border-cream-dark text-dark hover:border-dark"
                                  }`}
                                >
                                  {size}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-stretch gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center border border-cream-dark">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="flex h-12 w-12 items-center justify-center text-dark transition-colors duration-200 hover:text-blue disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="flex h-12 w-14 items-center justify-center border-x border-cream-dark text-custom-sm font-medium">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => (maxQuantity != null ? Math.min(maxQuantity, q + 1) : q + 1))}
                        aria-label="Increase quantity"
                        className="flex h-12 w-12 items-center justify-center text-dark transition-colors duration-200 hover:text-blue disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={atMax || (maxQuantity != null && maxQuantity <= 0)}
                      >
                        +
                      </button>
                    </div>
                    {maxQuantity != null && (
                      <p className="text-2xs text-dark-4">
                        {maxQuantity === 0
                          ? "Out of stock"
                          : `Max ${maxQuantity} available${cartQty > 0 ? ` (${cartQty} in cart)` : ""}`}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (maxQuantity != null && maxQuantity <= 0) return;
                      if (hasSizeVariants && activeSizeVariantIdx === null) return;
                      handleAddToCart();
                    }}
                    disabled={addDisabled}
                    className={`btn-primary h-12 flex-1 ${addDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    {maxQuantity != null && maxQuantity <= 0
                      ? "Out of stock"
                      : hasSizeVariants && activeSizeVariantIdx === null
                        ? "Choose a variant"
                        : "Add to cart"}
                  </button>

                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`flex h-12 w-12 items-center justify-center border transition-colors duration-200 ${
                      isWishlisted
                        ? "border-blue bg-blue text-white"
                        : "border-cream-dark text-dark hover:border-dark hover:text-blue"
                    }`}
                  >
                    <svg className="fill-current" width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.62436 4.42423C3.96537 5.18256 2.75 6.98626 2.75 9.13713C2.75 11.3345 3.64922 13.0283 4.93829 14.4798C6.00072 15.6761 7.28684 16.6677 8.54113 17.6346C8.83904 17.8643 9.13515 18.0926 9.42605 18.3219C9.95208 18.7366 10.4213 19.1006 10.8736 19.3649C11.3261 19.6293 11.6904 19.75 12 19.75C12.3096 19.75 12.6739 19.6293 13.1264 19.3649C13.5787 19.1006 14.0479 18.7366 14.574 18.3219C14.8649 18.0926 15.161 17.8643 15.4589 17.6346C16.7132 16.6677 17.9993 15.6761 19.0617 14.4798C20.3508 13.0283 21.25 11.3345 21.25 9.13713C21.25 6.98626 20.0346 5.18256 18.3756 4.42423C16.7639 3.68751 14.5983 3.88261 12.5404 6.02077C12.399 6.16766 12.2039 6.25067 12 6.25067C11.7961 6.25067 11.601 6.16766 11.4596 6.02077C9.40166 3.88261 7.23607 3.68751 5.62436 4.42423ZM12 4.45885C9.68795 2.39027 7.09896 2.1009 5.00076 3.05999C2.78471 4.07296 1.25 6.42506 1.25 9.13713C1.25 11.8027 2.3605 13.8361 3.81672 15.4758C4.98287 16.789 6.41022 17.888 7.67083 18.8586C7.95659 19.0786 8.23378 19.2921 8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.66C10.6739 20.9855 11.3096 21.25 12 21.25C12.6904 21.25 13.3261 20.9855 13.8832 20.66C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999C15.7662 19.2921 16.0434 19.0786 16.3292 18.8586C17.5898 17.888 19.0171 16.789 20.1833 15.4758C21.6395 13.8361 22.75 11.8027 22.75 9.13713C22.75 6.42506 21.2153 4.07296 18.9992 3.05999C16.901 2.1009 14.3121 2.39027 12 4.45885Z"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Details tabs */}
      <section className="pt-16 xl:pt-20">
        <div className="section-container">
          <div className="flex items-center gap-8 border-b border-cream-dark">
            {tabs.map((item, key) => (
              <button
                key={key}
                onClick={() => setActiveTab(item.id)}
                className={`relative -mb-px pb-4 text-custom-sm font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
                  activeTab === item.id
                    ? "border-b-2 border-ink text-dark"
                    : "text-dark-4 hover:text-dark"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className={`pt-8 ${activeTab === "tabOne" ? "block" : "hidden"}`}>
            <div className="max-w-[720px]">
              {product.description ? (
                <p className="whitespace-pre-line text-custom-sm leading-relaxed text-body">
                  {product.description}
                </p>
              ) : (
                <p className="text-custom-sm text-dark-4">No description available.</p>
              )}
            </div>
          </div>

          <div className={`pt-8 ${activeTab === "tabTwo" ? "block" : "hidden"}`}>
            <div className="max-w-[720px]">
              {product.policy ? (
                <p className="whitespace-pre-line text-custom-sm leading-relaxed text-body">
                  {product.policy}
                </p>
              ) : (
                <p className="text-custom-sm text-dark-4">
                  {deliveryText} Easy 7-day returns on unworn items.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopDetails;
