"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/formatPrice";

const OrdersTable = ({ orders }: { orders: any[] }) => {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch("/api/admin/order/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Order status updated");
      // Ideally revalidate data here or use router.refresh()
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">
                Order Number
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black">
                Customer
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                Date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                Total
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
            {orders.map((order, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                  <h5 className="font-medium text-black">
                    {order.orderNumber}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black">{order.customerName}</p>
                  <p className="text-sm">{order.customerEmail}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p className="text-black">${formatPrice(order.total)}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      order.status === "delivered"
                        ? "bg-success text-success"
                        : order.status === "cancelled"
                        ? "bg-danger text-danger"
                        : "bg-warning text-warning"
                    }`}
                  >
                    {order.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updating === order._id}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
