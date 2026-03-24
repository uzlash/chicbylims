import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import {
  getFilteredProducts,
  getAllCategories,
  getAllColors,
  getAllSizes,
  getPriceBounds,
} from "@/lib/sanity.queries";
import {
  sanityProductsToProducts,
  sanityCategoriesToCategories,
} from "@/lib/sanityHelpers";
import { Metadata } from "next";

type Props = {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params;
  const brandName =
    brand === "heim"
      ? "HEIM Kitchenware"
      : brand === "kinder"
      ? "Kinder Footwear"
      : "Store";

  return {
    title: `${brandName} Shop | NextCommerce`,
    description: `Browse products from ${brandName}.`,
  };
}

const BrandShopWithSidebarPage = async ({ params, searchParams }: Props) => {
  const { brand } = await params;
  const resolvedSearchParams = await searchParams;

  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : undefined;
  const category =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : undefined;
  const minPrice =
    typeof resolvedSearchParams.minPrice === "string"
      ? parseFloat(resolvedSearchParams.minPrice)
      : undefined;
  const maxPrice =
    typeof resolvedSearchParams.maxPrice === "string"
      ? parseFloat(resolvedSearchParams.maxPrice)
      : undefined;
  const color =
    typeof resolvedSearchParams.color === "string"
      ? resolvedSearchParams.color
      : undefined;
  const size =
    typeof resolvedSearchParams.size === "string"
      ? resolvedSearchParams.size
      : undefined;
  const page =
    typeof resolvedSearchParams.page === "string"
      ? parseInt(resolvedSearchParams.page)
      : 1;
  const limit = 20;

  const [data, categories, colors, sizes, priceBounds] = await Promise.all([
    getFilteredProducts({
      search,
      category,
      minPrice,
      maxPrice,
      color,
      size,
      page,
      limit,
      brand,
    }),
    getAllCategories(brand),
    getAllColors(brand),
    getAllSizes(brand),
    getPriceBounds(brand),
  ]);

  const products = sanityProductsToProducts(data.products || []);
  const allCategories = sanityCategoriesToCategories(categories || []);

  return (
    <main>
      <ShopWithSidebar
        initialProducts={products}
        categories={allCategories}
        colors={colors || []}
        sizes={sizes || []}
        totalProducts={data.total}
        currentPage={page}
        productsPerPage={limit}
        brand={brand}
        priceBounds={priceBounds}
      />
    </main>
  );
};

export default BrandShopWithSidebarPage;
