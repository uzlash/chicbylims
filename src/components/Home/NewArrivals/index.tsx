import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { Product } from "@/types/product";

interface NewArrivalProps {
  products: Product[];
  brand?: string;
}

const NewArrival = ({ products, brand }: NewArrivalProps) => {
  if (!products?.length) return null;
  const brandPrefix = brand ? `/${brand}` : "";

  return (
    <section className="pt-20 xl:pt-28">
      <div className="section-container">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="eyebrow text-forest">This week&apos;s drop</span>
          <h2 className="heading-serif mt-3 text-display-3">Seen In Colours</h2>
          <p className="mt-3 max-w-[520px] text-custom-sm text-body">
            Fresh arrivals in our boldest prints — styled to be seen and made to be worn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((item, key) => (
            <ProductItem item={item} key={key} brand={brand} badge="New arrival" disableQuickView />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href={`${brandPrefix}/shop`} className="btn-outline">
            View all new in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
