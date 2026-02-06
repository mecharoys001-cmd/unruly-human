import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey || "dummy_key", {
  apiVersion: "2026-01-28.clover",
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { size } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Alloy 000 Bomber Jacket",
              description: `Size: ${size || "M"} — Limited Edition Biomechanical Art`,
              images: ["https://unrulyhuman.com/images/DSC01001.jpg"],
            },
            unit_amount: 30000, // $300.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/#buy`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "JP"],
      },
      metadata: {
        size: size || "M",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
