"use client";
import React from "react";
import { Product } from "@/types/product";
import ProductItem from "@/components/Common/ProductItem";

const SingleGridItem = ({ item, brand }: { item: Product; brand?: string }) => {
  return (
    <ProductItem
      item={item}
      brand={brand}
      disableQuickView
      badge={item.productOfMonth ? "Product of the month" : undefined}
    />
  );
};

export default SingleGridItem;
