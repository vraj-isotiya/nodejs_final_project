import mongoose from "mongoose";

export default mongoose.model(
  "Category",
  new mongoose.Schema(
    {
      name: String,
      slug: { type: String, unique: true },
      isActive: Boolean,
    },
    { timestamps: true }
  )
);
