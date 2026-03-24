import { NextRequest, NextResponse } from "next/server";
import { clientWithToken } from "@/lib/sanity.client";

const PAYSTACK_BASE = "https://api.paystack.co";

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Paystack is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { orderId, orderNumber } = body;
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await clientWithToken.fetch<{
      total: number;
      currency: string;
      customerEmail: string;
      paymentStatus: string;
    }>(
      `*[_type == "order" && _id == $id][0] { total, currency, customerEmail, paymentStatus }`,
      { id: orderId }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }
    if (order.currency !== "NGN") {
      return NextResponse.json(
        { error: "Paystack only supports NGN orders" },
        { status: 400 }
      );
    }

    const amountKobo = Math.round(Number(order.total) * 100);
    if (amountKobo < 50) {
      return NextResponse.json(
        { error: "Amount too small for Paystack" },
        { status: 400 }
      );
    }

    const baseUrl = request.nextUrl.origin;
    const callbackUrl = `${baseUrl}/api/payment/paystack/callback`;

    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: order.customerEmail,
        amount: amountKobo,
        reference: orderNumber || orderId,
        callback_url: callbackUrl,
      }),
    });

    const data = await res.json();
    if (!data.status || !data.data?.authorization_url) {
      return NextResponse.json(
        { error: data.message || "Failed to initialize Paystack transaction" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("Paystack init error:", err);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
