import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.json({ items: [] });

  const items = await CartItem.find({ cartId: cart._id });
  res.json({ cart, items });
};

export const addToCart = async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) throw new Error("Product not found");

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $setOnInsert: { totalPrice: 0 } },
    { upsert: true, new: true }
  );

  const item = await CartItem.findOneAndUpdate(
    { cartId: cart._id, productId: product._id },
    {
      $inc: { quantity: req.body.quantity || 1 },
      $setOnInsert: {
        title: product.title,
        price: product.price,
        image: product.images?.[0],
      },
    },
    { upsert: true, new: true }
  );

  res.status(201).json(item);
};

export const updateCartItem = async (req, res) => {
  const item = await CartItem.findByIdAndUpdate(
    req.params.itemId,
    { quantity: req.body.quantity },
    { new: true }
  );
  res.json(item);
};

export const removeCartItem = async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.itemId);
  res.json({ success: true });
};

export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.json({ success: true });

  await CartItem.deleteMany({ cartId: cart._id });
  res.json({ success: true });
};
