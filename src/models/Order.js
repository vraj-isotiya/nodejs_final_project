import mongoose from "mongoose";

export default mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      orderNumber: String,
      userId: { type: mongoose.Types.ObjectId, ref: "User" },
      subtotal: Number,
      tax: Number,
      shippingFee: Number,
      discount: Number,
      totalAmount: Number,
      status: String,
      paymentProvider: String,
      paymentIntentId: String,
    },
    { timestamps: true }
  )
);
