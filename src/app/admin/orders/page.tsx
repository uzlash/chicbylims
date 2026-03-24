import React from "react";
import { clientWithToken } from "@/lib/sanity.client";
import OrdersTable from "@/components/Admin/OrdersTable";

export const revalidate = 0;

async function getOrders() {
  return clientWithToken.fetch(
    `*[_type == "order"] | order(createdAt desc) {
      _id,
      orderNumber,
      customerName,
      customerEmail,
      total,
      status,
      paymentStatus,
      createdAt,
      items
    }`
  );
}

const AdminOrdersPage = async () => {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black">
          Orders
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default AdminOrdersPage;
