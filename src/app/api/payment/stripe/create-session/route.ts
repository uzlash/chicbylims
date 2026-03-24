import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clientWithToken } from "@/lib/sanity.client";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { orderId, orderNumber, successUrl, cancelUrl } = body;
    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const order = await clientWithToken.fetch<{
      total: number;
      currency: string;
      paymentStatus: string;
    }>(
      `*[_type == "order" && _id == $id][0] { total, currency, paymentStatus }`,
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
    if (order.currency !== "USD") {
      return NextResponse.json(
        { error: "Stripe session is for USD orders only" },
        { status: 400 }
      );
    }

    const amountCents = Math.round(Number(order.total) * 100);
    if (amountCents < 50) {
      return NextResponse.json(
        { error: "Amount too small for Stripe" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Order ${orderNumber || orderId}`,
              description: "Chibylims fabrics order",
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${request.nextUrl.origin}/order-confirmation?orderId=${orderId}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/checkout`,
      metadata: {
        orderId,
        orderNumber: orderNumber || "",
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Stripe create-session error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create session" },
      { status: 500 }
    );
  }
}
