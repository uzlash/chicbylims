import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { formatPrice, type CurrencyCode } from "@/lib/formatPrice";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const orderCurrency: CurrencyCode = orderItem.currency === "USD" ? "USD" : "NGN";
  const orderSymbol = orderCurrency === "USD" ? "$" : "₦";
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleModal = (open: boolean) => {
    setShowDetails(open);
  };

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red">
              #{orderItem.orderNumber?.slice(-8) || orderItem.orderId?.slice(-8)}
            </p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">
              {new Date(orderItem.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
                orderItem.status === "delivered"
                  ? "text-green bg-green-light-6"
                  : orderItem.status === "on-hold"
                  ? "text-red bg-red-light-6"
                  : orderItem.status === "processing" || orderItem.status === "pending"
                  ? "text-yellow bg-yellow-light-4"
                  : "Unknown Status"
              }`}
            >
              {orderItem.status}
            </p>
          </div>

          <div className="min-w-[213px]">
            <p className="text-custom-sm text-dark">
              {orderItem.items?.[0]?.productName} 
              {orderItem.items?.length > 1 ? ` + ${orderItem.items.length - 1} more` : ''}
            </p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">
              {orderSymbol}
              {formatPrice(orderItem.total, orderCurrency)}
            </p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions toggleDetails={toggleDetails} />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5">
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2"> Order:</span> #
                {orderItem.orderNumber?.slice(-8) || orderItem.orderId?.slice(-8)}
              </p>
            </div>
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Date:</span>{" "}
                {new Date(orderItem.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Status:</span>{" "}
                <span
                  className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${
                    orderItem.status === "delivered"
                      ? "text-green bg-green-light-6"
                      : orderItem.status === "on-hold"
                      ? "text-red bg-red-light-6"
                      : orderItem.status === "processing" || orderItem.status === "pending"
                      ? "text-yellow bg-yellow-light-4"
                      : "Unknown Status"
                  }`}
                >
                  {orderItem.status}
                </span>
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Title:</span> 
                {orderItem.items?.[0]?.productName} 
                {orderItem.items?.length > 1 ? ` + ${orderItem.items.length - 1} more` : ''}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Total:</span> {orderSymbol}
                {formatPrice(orderItem.total, orderCurrency)}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Actions:</span>{" "}
                <OrderActions toggleDetails={toggleDetails} />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
