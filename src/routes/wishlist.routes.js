import { Router } from "express";
import * as c from "../controllers/wishlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const r = Router();

r.use(protect);
r.post("/", c.addToWishlist);
r.get("/", c.getWishlist);
r.delete("/:productId", c.removeFromWishlist);

export default r;
