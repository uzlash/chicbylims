import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getAllProducts } from "@/lib/sanity.queries";
import { sanityProductsToProducts } from "@/lib/sanityHelpers";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop",
  description: "Shop authentic ready-to-wear Ankara, lace and premium fabrics.",
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
