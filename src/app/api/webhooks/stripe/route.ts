import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // For now, skip signature verification in test mode
  // In production, uncomment and add STRIPE_WEBHOOK_SECRET to env
  /*
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  */

  const event = JSON.parse(body) as Stripe.Event;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Payment successful!", {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        size: session.metadata?.size,
        amount: session.amount_total,
      });
      // TODO: Send confirmation email, update inventory, etc.
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("💰 Payment intent succeeded:", paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed:", paymentIntent.last_payment_error?.message);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
