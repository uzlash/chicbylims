"use client";

import React, { useState, useMemo, useRef } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import PaymentMethod, { type PaymentMethodType } from "./PaymentMethod";
import Billing from "./Billing";
import ShippingMethod, {
  type DeliveryOption,
  DELIVERY_FEES,
  INTERSTATE_ZONES,
} from "./ShippingMethod";
import { useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { removeAllItemsFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/app/context/CurrencyContext";

const DEFAULT_INTERSTATE_ZONE = INTERSTATE_ZONES[0]?.value ?? "northwest";

const Checkout = () => {
  const [shippingMethod, setShippingMethod] = useState<DeliveryOption>("store_pickup");
  const [interstateZone, setInterstateZone] = useState(DEFAULT_INTERSTATE_ZONE);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("paystack");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const submitLockRef = useRef(false);
  const checkoutAttemptIdRef = useRef<string | null>(null);
  /** True while redirecting to Paystack/Stripe — avoids empty-cart UI flash after cart clear. */
  const leavingForPaymentRef = useRef(false);

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { toDisplayAmount, symbol, currency } = useCurrency();

  // Promotion: Product of the month + 2 other items = free delivery within Abuja
  const hasProductOfMonth = cartItems.some((item) => item.productOfMonth);
  const hasProductOfMonthPlusTwoOthers = hasProductOfMonth && cartItems.length >= 3;
  const freeAbujaDelivery =
    shippingMethod === "abuja" && hasProductOfMonthPlusTwoOthers;

  const shippingCost =
    shippingMethod === "store_pickup"
      ? 0
      : freeAbujaDelivery
        ? 0
        : shippingMethod === "abuja"
          ? DELIVERY_FEES.abuja
          : INTERSTATE_ZONES.find((z) => z.value === interstateZone)?.fee ?? DELIVERY_FEES.interstate;

  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitLockRef.current || loading) return;
    submitLockRef.current = true;
    setLoading(true);
    setOrderError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const fullName = (data.fullName as string)?.trim() || "";
    const deliveryAddress = (data.deliveryAddress as string)?.trim() || "";

    if (!checkoutAttemptIdRef.current) {
      checkoutAttemptIdRef.current =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    const orderData = {
      items: cartItems,
      paymentMethod,
      checkoutAttemptId: checkoutAttemptIdRef.current,
      email: (data.email as string) || session?.user?.email,
      name: fullName,
      phone: data.phone,
      shippingAddress: {
        fullName,
        address1: deliveryAddress,
        address2: "",
        city: "",
        country: "Nigeria",
        postalCode: "",
      },
      billingAddress: {
        fullName,
        address1: deliveryAddress,
        address2: "",
        city: "",
        country: "Nigeria",
      },
      shippingMethod,
      ...(shippingMethod === "interstate" && { interstateZone }),
      subtotal,
      shippingCost,
      tax: 0,
      total,
      notes: data.notes,
    };

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = result.error || "Failed to create order";
        setOrderError(message);
        toast.error(message);
        setLoading(false);
        submitLockRef.current = false;
        return;
      }

      const { orderId, orderNumber, total: orderTotal, currency: orderCurrency } = result;
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const successUrl = `${baseUrl}/order-confirmation?orderId=${orderId}${orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : ""}&total=${encodeURIComponent(String(orderTotal ?? total))}&currency=${encodeURIComponent(orderCurrency ?? currency)}`;
      const cancelUrl = `${baseUrl}/checkout`;

      if (paymentMethod === "paystack") {
        const initRes = await fetch("/api/payment/paystack/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, orderNumber }),
        });
        const initData = await initRes.json();
        if (!initRes.ok || !initData.authorization_url) {
          const message = initData.error || "Failed to initialize payment";
          setOrderError(message);
          toast.error(message);
          setLoading(false);
          submitLockRef.current = false;
          return;
        }
        leavingForPaymentRef.current = true;
        dispatch(removeAllItemsFromCart());
        toast.success("Redirecting to payment…");
        window.location.replace(initData.authorization_url);
        return;
      }

      if (paymentMethod === "stripe") {
        const sessionRes = await fetch("/api/payment/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, orderNumber, successUrl, cancelUrl }),
        });
        const sessionData = await sessionRes.json();
        if (!sessionRes.ok || !sessionData.url) {
          const message = sessionData.error || "Failed to create payment session";
          setOrderError(message);
          toast.error(message);
          setLoading(false);
          submitLockRef.current = false;
          return;
        }
        leavingForPaymentRef.current = true;
        dispatch(removeAllItemsFromCart());
        toast.success("Redirecting to payment…");
        window.location.replace(sessionData.url);
        return;
      }

      setLoading(false);
      submitLockRef.current = false;
    } catch (error) {
      console.error(error);
      const message = "An error occurred. Please try again.";
      setOrderError(message);
      toast.error(message);
      setLoading(false);
      submitLockRef.current = false;
    }
  };

  if (cartItems.length === 0) {
    if (leavingForPaymentRef.current) {
      return (
        <>
          <Breadcrumb title={"Checkout"} pages={["checkout"]} />
          <section className="overflow-hidden py-20 bg-gray-2">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center py-16">
              <p className="text-xl font-medium text-dark">Redirecting to secure payment…</p>
              <p className="text-custom-sm text-dark-4 mt-2">Please wait — do not refresh this page.</p>
            </div>
          </section>
        </>
      );
    }
    return (
      <>
        <Breadcrumb title={"Checkout"} pages={["checkout"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="mb-8">Add some products to your cart to proceed to checkout.</p>
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              Return to Shop
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              <div className="lg:max-w-[670px] w-full">
                {!session && <Login />}

                <Billing
                  key={session ? "logged-in" : "guest"}
                  defaultFullName={session?.user?.name ?? undefined}
                  defaultEmail={session?.user?.email ?? undefined}
                />

                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Delivery notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      placeholder="Notes about your order, e.g. special instructions for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Your order</h3>
                  </div>

                  <div className="px-4 sm:px-8.5 pt-4">
                    <div
                      className={`rounded-lg p-4 mb-5 border ${
                        freeAbujaDelivery
                          ? "bg-green-light-6 border-green-light-4"
                          : "bg-blue-light-5 border-blue-light-3"
                      }`}
                    >
                      {freeAbujaDelivery ? (
                        <p className="text-custom-sm font-medium text-dark">
                          You&apos;ve unlocked free Abuja delivery (Product of the Month + 2 items).
                        </p>
                      ) : (
                        <>
                          <p className="text-custom-sm font-medium text-dark mb-2">
                            Add a Product of the Month and 2 other items to get free delivery within Abuja.
                          </p>
                          <Link
                            href="/shop"
                            className="text-custom-sm font-semibold text-blue hover:text-blue-dark hover:underline"
                          >
                            Continue shopping →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Product</h4>
                      <h4 className="font-medium text-dark text-right">Subtotal</h4>
                    </div>

                    {cartItems.map((item, key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                      >
                        <p className="text-dark">
                          {item.title} x {item.quantity}
                        </p>
                        <p className="text-dark text-right">
                          {symbol}{formatPrice(toDisplayAmount((item.discountedPrice ?? item.price) * item.quantity), currency)}
                        </p>
                      </div>
                    ))}

                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Delivery</p>
                        {freeAbujaDelivery && (
                          <p className="text-custom-sm text-green font-medium mt-0.5">
                            Free Abuja delivery (Product of the Month + 2 items)
                          </p>
                        )}
                      </div>
                      <p className="text-dark text-right">
                        {symbol}{formatPrice(toDisplayAmount(shippingCost), currency)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">
                        {symbol}{formatPrice(toDisplayAmount(total), currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <ShippingMethod
                  selected={shippingMethod}
                  interstateZone={interstateZone}
                  onChange={setShippingMethod}
                  onInterstateZoneChange={setInterstateZone}
                />

                <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />

                {orderError && (
                  <div
                    role="alert"
                    className="mt-7.5 flex items-start gap-3 rounded-lg border border-red-light-4 bg-red-light-6 px-4 py-3 text-red text-custom-sm"
                  >
                    <svg
                      className="mt-0.5 flex-shrink-0"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="flex-1">{orderError}</p>
                    <button
                      type="button"
                      onClick={() => setOrderError(null)}
                      className="flex-shrink-0 rounded p-1 hover:bg-red-light-4 focus:outline-none focus:ring-2 focus:ring-red"
                      aria-label="Dismiss error"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                        <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50"
                >
                  {loading ? "Processing…" : "Place order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
