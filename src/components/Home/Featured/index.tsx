import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { Product } from "@/types/product";

interface FeaturedProps {
  products: Product[];
  brand?: string;
}

const Featured = ({ products, brand }: FeaturedProps) => {
  if (!products?.length) return null;

  const brandPrefix = brand ? `/${brand}` : "";

  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99984 1.66669L12.5748 7.35002L18.3332 8.09169L13.7498 12.3084L14.9498 17.9834L9.99984 15.1584L5.04984 17.9834L6.24984 12.3084L1.6665 8.09169L7.42484 7.35002L9.99984 1.66669Z"
                  stroke="#CD4298"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Picks
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Featured Products
            </h2>
          </div>

          <Link
            href={`${brandPrefix}/shop`}
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
          {products.map((item, key) => (
            <ProductItem item={item} key={key} brand={brand} disableQuickView />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
