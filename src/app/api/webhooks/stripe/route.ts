import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey || "dummy_key", {
  apiVersion: "2026-01-28.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const event = JSON.parse(body) as Stripe.Event;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      const size = session.metadata?.size;

      console.log("✅ Payment successful!", {
        sessionId: session.id,
        customerEmail,
        size,
        amount: session.amount_total,
      });

      if (customerEmail) {
        try {
          await resend.emails.send({
            from: "Unruly Human <orders@unruly.fashion>",
            to: customerEmail,
            subject: "Order Confirmed: Alloy 000 Bomber Jacket",
            html: `
              <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="text-align: center; letter-spacing: 0.2em; font-weight: 200;">UNRULY HUMAN</h1>
                <p style="text-align: center; color: #888; letter-spacing: 0.1em; margin-bottom: 40px;">ORDER CONFIRMED</p>
                
                <p style="font-size: 16px; line-height: 1.6;">Thank you for your order. Each Alloy 000 jacket is a canvas of biomechanical chaos, and yours is now being prepared.</p>
                
                <div style="border: 1px solid #333; padding: 20px; margin: 30px 0;">
                  <p style="margin: 0; color: #888; font-size: 12px; letter-spacing: 0.1em;">PRODUCT</p>
                  <p style="margin: 10px 0; font-size: 18px;">Alloy 000 Bomber Jacket</p>
                  <p style="margin: 0; color: #888;">Size: ${size}</p>
                </div>
                
                <p style="color: #888; font-size: 14px; line-height: 1.6;">You'll receive another update once your jacket has shipped from our facility in England.</p>
                
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #222;">
                  <p style="font-size: 12px; color: #555; letter-spacing: 0.2em;">WEARABLE ART • LIMITED EDITION</p>
                </div>
              </div>
            `,
          });
          console.log("📧 Confirmation email sent to:", customerEmail);
        } catch (emailError) {
          console.error("❌ Failed to send confirmation email:", emailError);
        }
      }
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
