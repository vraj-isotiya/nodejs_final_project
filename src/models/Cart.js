import mongoose from "mongoose";

export default mongoose.model(
  "Cart",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Types.ObjectId, ref: "User", unique: true },
      totalPrice: Number,
    },
    { timestamps: true }
  )
);
