import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

/**
 * CREATE PAYMENT INTENT
 * Called by client before checkout
 */
export const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is required",
    });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  if (order.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Order is not payable",
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalAmount * 100),
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
      userId: order.userId.toString(),
    },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature",
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const intent = event.data.object;

  // Metadata validation (CRITICAL)
  const orderId = intent.metadata?.orderId;
  const userId = intent.metadata?.userId;

  if (!orderId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Missing metadata",
    });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      // 🔐 Idempotency check
      const exists = await Payment.findOne({
        paymentIntentId: intent.id,
      });

      if (exists) break;

      await Payment.create({
        orderId,
        userId,
        provider: "stripe",
        amount: intent.amount_received / 100,
        currency: intent.currency,
        paymentIntentId: intent.id,
        status: "succeeded",
      });

      await Order.findByIdAndUpdate(orderId, {
        status: "paid",
        paymentProvider: "stripe",
        paymentIntentId: intent.id,
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const exists = await Payment.findOne({
        paymentIntentId: intent.id,
      });

      if (exists) break;

      await Payment.create({
        orderId,
        userId,
        provider: "stripe",
        amount: intent.amount / 100,
        currency: intent.currency,
        paymentIntentId: intent.id,
        status: "failed",
      });

      break;
    }

    default:
      // intentionally ignored
      break;
  }

  res.json({ received: true });
};
