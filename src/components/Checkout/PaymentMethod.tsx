"use client";

import React from "react";

export type PaymentMethodType = "paystack" | "stripe";

interface PaymentMethodProps {
  value: PaymentMethodType;
  onChange: (method: PaymentMethodType) => void;
}

const PaymentMethod = ({ value, onChange }: PaymentMethodProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment method</h3>
      </div>
      <div className="p-4 sm:p-8.5 space-y-4">
        <p className="text-dark text-custom-sm">
          Choose how you want to pay: locally (NGN) or internationally (USD).
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <label
            className={`flex flex-1 items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              value === "paystack"
                ? "border-blue bg-blue-light-5"
                : "border-gray-3 hover:border-gray-4"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="paystack"
              checked={value === "paystack"}
              onChange={() => onChange("paystack")}
              className="sr-only"
            />
            <span className="font-medium text-dark">Pay locally (Paystack)</span>
            <span className="text-custom-sm text-dark-4">NGN · Card / Bank</span>
          </label>
          <label
            className={`flex flex-1 items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              value === "stripe"
                ? "border-blue bg-blue-light-5"
                : "border-gray-3 hover:border-gray-4"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={value === "stripe"}
              onChange={() => onChange("stripe")}
              className="sr-only"
            />
            <span className="font-medium text-dark">Pay internationally (Stripe)</span>
            <span className="text-custom-sm text-dark-4">USD · Card</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
