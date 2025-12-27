import { Router } from "express";
import * as c from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { role } from "../middlewares/role.middleware.js";

const r = Router();

r.use(protect);

r.post("/", c.createOrder);
r.get("/me", c.getMyOrders);
r.get("/:id", c.getOrder);
r.put("/:id/status", role("admin"), c.updateOrderStatus);

export default r;
