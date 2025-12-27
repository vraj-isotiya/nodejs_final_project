import { Router } from "express";
import auth from "./auth.routes.js";
import products from "./product.routes.js";
import categories from "./category.routes.js";
import wishlist from "./wishlist.routes.js";
import cart from "./cart.routes.js";
import orders from "./order.routes.js";
import payments from "./payment.routes.js";

const r = Router();

r.use("/auth", auth);
r.use("/products", products);
r.use("/categories", categories);
r.use("/wishlist", wishlist);
r.use("/cart", cart);
r.use("/orders", orders);
r.use("/payments", payments);

export default r;
