import React from "react";

interface BillingProps {
  /** Pre-fill from session when logged in */
  defaultFullName?: string | null;
  defaultEmail?: string | null;
}

const Billing = ({ defaultFullName, defaultEmail }: BillingProps) => {
  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Contact & delivery
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="mb-5">
          <label htmlFor="fullName" className="block mb-2.5">
            Full name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="John Doe"
            defaultValue={defaultFullName ?? ""}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Phone <span className="text-red">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="e.g. 08012345678"
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2.5">
            Email address <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            defaultValue={defaultEmail ?? ""}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <label htmlFor="deliveryAddress" className="block mb-2.5">
            Delivery address <span className="text-red">*</span>
          </label>
          <textarea
            name="deliveryAddress"
            id="deliveryAddress"
            rows={3}
            placeholder="Street, area, city, state"
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
