import mongoose from "mongoose";

export default mongoose.model(
  "OrderItem",
  new mongoose.Schema({
    orderId: { type: mongoose.Types.ObjectId, ref: "Order" },
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    title: String,
    price: Number,
    quantity: Number,
    image: String,
  })
);
