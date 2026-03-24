import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { formatPrice, type CurrencyCode } from "@/lib/formatPrice";

export const metadata: Metadata = {
  title: "Order Confirmation | Chibylims",
  description: "Order Confirmation Page",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const OrderConfirmationPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;
  const orderNumber = typeof params.orderNumber === "string" ? decodeURIComponent(params.orderNumber) : undefined;
  const totalParam = typeof params.total === "string" ? params.total : undefined;
  const total = totalParam != null && !Number.isNaN(Number(totalParam)) ? Number(totalParam) : undefined;
  const currencyParam = typeof params.currency === "string" ? params.currency : "NGN";
  const currencyCode: CurrencyCode = currencyParam === "USD" ? "USD" : "NGN";
  const currencySymbol = currencyCode === "USD" ? "$" : "₦";

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-dark mb-4">
            Order successful
          </h1>

          <p className="text-dark-4 mb-8">
            Thank you for your order. It has been placed successfully.
            {(orderNumber || orderId) && (
              <span className="block mt-2 font-medium">
                {orderNumber ? `Order number: ${orderNumber}` : `Order ID: ${orderId}`}
              </span>
            )}
          </p>

          {total != null && (
            <p className="text-dark font-medium mb-8">
              Total paid: {currencySymbol}
              {formatPrice(total, currencyCode)}
            </p>
          )}

          <div className="flex justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              Continue Shopping
            </Link>
            <Link
              href="/my-account"
              className="inline-flex font-medium text-dark border border-gray-3 py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-1"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
