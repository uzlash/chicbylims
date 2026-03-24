import { NextRequest, NextResponse } from "next/server";
import { clientWithToken } from "@/lib/sanity.client";

const PAYSTACK_BASE = "https://api.paystack.co";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.redirect(new URL("/checkout?error=missing_reference", request.url));
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.redirect(new URL("/checkout?error=config", request.url));
  }

  try {
    const res = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      }
    );
    const data = await res.json();

    if (!data.status || !data.data?.status || data.data.status !== "success") {
      return NextResponse.redirect(
        new URL(`/checkout?error=verification_failed&reference=${encodeURIComponent(reference)}`, request.url)
      );
    }

    const orderDoc = await clientWithToken.fetch<{ _id: string; paymentStatus: string; orderNumber?: string; total?: number; currency?: string }>(
      `*[_type == "order" && (orderNumber == $ref || _id == $ref)][0] { _id, paymentStatus, orderNumber, total, currency }`,
      { ref: reference }
    );

    if (!orderDoc) {
      return NextResponse.redirect(new URL("/checkout?error=order_not_found", request.url));
    }

    const base = request.nextUrl.origin;
    const params = new URLSearchParams({ orderId: orderDoc._id });
    if (orderDoc.orderNumber) params.set("orderNumber", orderDoc.orderNumber);
    if (orderDoc.total != null) params.set("total", String(orderDoc.total));
    if (orderDoc.currency) params.set("currency", orderDoc.currency);

    if (orderDoc.paymentStatus === "paid") {
      return NextResponse.redirect(new URL(`/order-confirmation?${params.toString()}`, base));
    }

    await clientWithToken
      .patch(orderDoc._id)
      .set({
        paymentStatus: "paid",
        paymentProviderReference: reference,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.redirect(new URL(`/order-confirmation?${params.toString()}`, base));
  } catch (err) {
    console.error("Paystack callback error:", err);
    return NextResponse.redirect(new URL("/checkout?error=callback_failed", request.url));
  }
}
