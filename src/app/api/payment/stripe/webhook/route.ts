import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clientWithToken } from "@/lib/sanity.client";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secret);
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.error("Stripe webhook: no orderId in metadata");
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    const orderDoc = await clientWithToken.fetch<{ _id: string; paymentStatus: string }>(
      `*[_type == "order" && _id == $id][0] { _id, paymentStatus }`,
      { id: orderId }
    );
    if (!orderDoc) {
      console.error("Stripe webhook: order not found", orderId);
      return NextResponse.json({ received: true }, { status: 200 });
    }
    if (orderDoc.paymentStatus === "paid") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await clientWithToken
      .patch(orderId)
      .set({
        paymentStatus: "paid",
        paymentProviderReference: session.id,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Stripe webhook: failed to update order", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
