import Wishlist from "../models/Wishlist.js";
import mongoose from "mongoose";

export const addToWishlist = async (req, res) => {
  const exists = await Wishlist.findOne({
    userId: req.user.id,
    productId: req.body.productId,
  });

  if (exists) throw new Error("Already in wishlist");

  const item = await Wishlist.create({
    userId: req.user.id,
    productId: req.body.productId,
  });

  res.status(201).json(item);
};

export const getWishlist = async (req, res) => {
  const list = await Wishlist.find({ userId: req.user.id }).populate(
    "productId"
  );
  res.json(list);
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  const deleted = await Wishlist.findOneAndDelete({
    userId: req.user.id,
    productId: new mongoose.Types.ObjectId(productId),
  });

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Wishlist item not found",
    });
  }

  res.json({
    success: true,
    message: "Removed from wishlist",
  });
};
