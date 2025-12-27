import { Router } from "express";
import * as c from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const r = Router();

r.use(protect);
r.get("/", c.getCart);
r.post("/", c.addToCart);
r.put("/item/:itemId", c.updateCartItem);
r.delete("/item/:itemId", c.removeCartItem);
r.delete("/", c.clearCart);

export default r;
