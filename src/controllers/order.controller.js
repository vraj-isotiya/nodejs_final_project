import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";

export const createOrder = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) throw new Error("Cart empty");

  const items = await CartItem.find({ cartId: cart._id });
  if (!items.length) throw new Error("Cart empty");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = await Order.create({
    orderNumber: `ORD-${Date.now()}`,
    userId: req.user.id,
    subtotal,
    tax: 0,
    shippingFee: 0,
    discount: 0,
    totalAmount: subtotal,
    status: "pending",
  });

  await OrderItem.insertMany(
    items.map((i) => ({
      orderId: order._id,
      productId: i.productId,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }))
  );

  await CartItem.deleteMany({ cartId: cart._id });

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new Error("Order not found");

  const items = await OrderItem.find({ orderId: order._id });
  res.json({ order, items });
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
};
