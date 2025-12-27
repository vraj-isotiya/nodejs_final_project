import mongoose from "mongoose";

export default mongoose.model(
  "Payment",
  new mongoose.Schema(
    {
      orderId: mongoose.Types.ObjectId,
      userId: mongoose.Types.ObjectId,
      provider: String,
      amount: Number,
      currency: String,
      paymentIntentId: String,
      status: String,
    },
    { timestamps: true }
  )
);
