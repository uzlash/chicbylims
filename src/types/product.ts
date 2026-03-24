export type Product = {
  title: string;
  description?: string;
  price: number;
  discountedPrice: number;
  id: string | number;
  slug?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  colors?: Array<{ name: string; value: string }>;
  sizes?: string[];
  colorVariants?: Array<{ color: { name: string; value: string }; sizes: string[] }>;
  /** Per-variant pricing (HEIM-style). When present, drives the price selector instead of colorVariants. */
  sizeVariants?: Array<{ label: string; price: number; comparePrice?: number }>;
  productOfMonth?: boolean;
  policy?: string;
  deliveryInfo?: string;
  /** Available quantity (from Sanity inventory). Used to cap cart quantity. */
  stock?: number;
};
