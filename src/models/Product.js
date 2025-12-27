import mongoose from "mongoose";

export default mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      slug: { type: String, unique: true, index: true },
      description: String,
      price: { type: Number, required: true },
      compareAtPrice: Number,
      stock: { type: Number, default: 0 },
      sku: { type: String, index: true },
      images: [String],
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true,
      },
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  )
);
