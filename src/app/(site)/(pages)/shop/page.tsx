import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";
import { getFilteredProducts, getAllCategories, getAllColors, getAllSizes, getPriceBounds } from "@/lib/sanity.queries";
import { sanityProductsToProducts, sanityCategoriesToCategories } from "@/lib/sanityHelpers";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ShopWithSidebarPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;
  const minPrice = typeof resolvedSearchParams.minPrice === 'string' ? parseFloat(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === 'string' ? parseFloat(resolvedSearchParams.maxPrice) : undefined;
  const color = typeof resolvedSearchParams.color === 'string' ? resolvedSearchParams.color : undefined;
  const size = typeof resolvedSearchParams.size === 'string' ? resolvedSearchParams.size : undefined;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
  const limit = 20;

  const brandSlug = "fabrics";
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
      brand: brandSlug,
    }),
    getAllCategories(brandSlug),
    getAllColors(brandSlug),
    getAllSizes(brandSlug),
    getPriceBounds(brandSlug),
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
        priceBounds={priceBounds}
      />
    </main>
  );
};

export default ShopWithSidebarPage;
