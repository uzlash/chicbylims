import MyAccount from "@/components/MyAccount";
import React from "react";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Account | Kinder Footwear & HEIM Kitchenware",
  description: "This is My Account page for Kinder Footwear & HEIM Kitchenware"
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
