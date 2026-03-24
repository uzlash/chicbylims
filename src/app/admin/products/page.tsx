import React from "react";
import { clientWithToken } from "@/lib/sanity.client";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

export const revalidate = 0;

async function getProducts() {
  return clientWithToken.fetch(
    `*[_type == "product"] | order(createdAt desc) {
      _id,
      name,
      price,
      inventory,
      status,
      category->{name},
      createdAt
    }`
  );
}

const AdminProductsPage = async () => {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black">
          Products
        </h2>
        <Link
          href="/studio/structure/product"
          target="_blank"
          className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">
                  Product Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black">
                  Category
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Price
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Inventory
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any, key: number) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black">
                      {product.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">{product.category?.name}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">${formatPrice(product.price)}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className={`text-black ${product.inventory < 10 ? "text-danger font-bold" : ""}`}>
                      {product.inventory}
                      {product.inventory < 10 && " (Low Stock)"}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        product.status === "active"
                          ? "bg-success text-success"
                          : "bg-warning text-warning"
                      }`}
                    >
                      {product.status}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <div className="flex items-center space-x-3.5">
                      <Link
                        href={`/studio/structure/product;${product._id}`}
                        target="_blank"
                        className="hover:text-primary"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
