import mongoose from "mongoose";

export default mongoose.model(
  "CartItem",
  new mongoose.Schema({
    cartId: { type: mongoose.Types.ObjectId, ref: "Cart" },
    productId: { type: mongoose.Types.ObjectId, ref: "Product" },
    title: String,
    price: Number,
    quantity: Number,
    image: String,
  })
);
