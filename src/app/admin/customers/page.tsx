import React from "react";
import { clientWithToken } from "@/lib/sanity.client";
import { formatPrice } from "@/lib/formatPrice";

export const revalidate = 0;

async function getCustomers() {
  return clientWithToken.fetch(
    `*[_type == "customer"] | order(createdAt desc) {
      _id,
      name,
      email,
      phone,
      totalOrders,
      totalSpent,
      createdAt
    }`
  );
}

const AdminCustomersPage = async () => {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black">
          Customers
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black">
                  Email
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Phone
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Orders
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Spent
                </th>
                <th className="py-4 px-4 font-medium text-black">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any, key: number) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                    <h5 className="font-medium text-black">
                      {customer.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">{customer.email}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">{customer.phone}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">{customer.totalOrders}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">${customer.totalSpent != null ? formatPrice(customer.totalSpent) : '0.00'}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4">
                    <p className="text-black">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </p>
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

export default AdminCustomersPage;
