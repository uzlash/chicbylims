import React from "react";
import { formatPrice, type CurrencyCode } from "@/lib/formatPrice";

const OrderDetails = ({ orderItem }: any) => {
  const orderCurrency: CurrencyCode = orderItem.currency === "USD" ? "USD" : "NGN";
  const orderSymbol = orderCurrency === "USD" ? "$" : "₦";
  return (
    <>
      <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Order</p>
        </div>
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Date</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Status</p>
        </div>

        {/* <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Title</p>
        </div> */}

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Total</p>
        </div>

        {/* <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Action</p>
        </div> */}
      </div>

      <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
        <div className="min-w-[111px]">
          <p className="text-custom-sm text-red">
            #{orderItem.orderNumber?.slice(-8) || orderItem.orderId?.slice(-8) || orderItem._id?.slice(-8)}
          </p>
        </div>
        <div className="min-w-[175px]">
          <p className="text-custom-sm text-dark">
            {orderItem.createdAt ? new Date(orderItem.createdAt).toLocaleDateString() : "—"}
          </p>
        </div>

        <div className="min-w-[128px]">
          <p
            className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
              orderItem.status === "delivered"
                ? "text-green bg-green-light-6"
                : orderItem.status === "on-hold"
                ? "text-red bg-red-light-6"
                : orderItem.status === "processing"
                ? "text-yellow bg-yellow-light-4"
                : "Unknown Status"
            }`}
          >
            {orderItem.status}
          </p>
        </div>

        {/* <div className="min-w-[213px]">
          <p className="text-custom-sm text-dark">{orderItem.orderTitle}</p>
        </div> */}

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">
            {typeof orderItem.total === "number"
              ? `${orderSymbol}${formatPrice(orderItem.total, orderCurrency)}`
              : orderItem.total}
          </p>
        </div>
      </div>
      <div className="px-7.5 w-full space-y-4 pt-4">
        {orderItem.shippingAddress && (
          <div>
            <p className="font-bold text-dark">Shipping Address</p>
            <p className="text-dark-4">
              {[orderItem.shippingAddress.fullName, orderItem.shippingAddress.address1]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
        )}
        {orderItem.notes && (
          <div>
            <p className="font-bold text-dark">Order notes</p>
            <p className="text-dark-4 whitespace-pre-wrap">{orderItem.notes}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderDetails;
