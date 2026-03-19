const Stripe = require("stripe");

const PLAN_CONFIG = {
  starter: {
    name: "Agent Academy Starter",
    amount: 14900, // £149.00
  },
  professional: {
    name: "Agent Academy Professional",
    amount: 39500, // £395.00
  },
  premium_intensive: {
    name: "Agent Academy Premium Intensive",
    amount: 89500, // £895.00
  },
};

exports.handler = async (event) => {
  
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { plan, userId, email } = body;

    if (!plan || !PLAN_CONFIG[plan]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid plan" }),
      };
    }

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    const selectedPlan = PLAN_CONFIG[plan];
    const siteUrl = process.env.URL || "http://localhost:8888";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/agent-academy/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/agent-academy/payment.html?plan=${encodeURIComponent(plan)}&cancelled=1`,
      client_reference_id: userId,
      customer_email: email || undefined,
      metadata: {
        user_id: userId,
        plan,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: selectedPlan.amount,
            product_data: {
              name: selectedPlan.name,
            },
          },
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("create-checkout-session error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unable to create checkout session",
      }),
    };
  }
};
