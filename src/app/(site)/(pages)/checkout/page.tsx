import React from "react";
import Checkout from "@/components/Checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | NextCommerce",
  description: "Complete your order",
};

const CheckoutPage = async () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
