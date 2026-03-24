import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getAllProducts } from "@/lib/sanity.queries";
import { sanityProductsToProducts } from "@/lib/sanityHelpers";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
};

export const revalidate = 60;

const ShopWithoutSidebarPage = async () => {
  const sanityProducts = await getAllProducts();
  const products = sanityProductsToProducts(sanityProducts || []);

  return (
    <main>
      <ShopWithoutSidebar initialProducts={products} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
