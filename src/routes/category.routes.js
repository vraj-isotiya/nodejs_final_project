import { Router } from "express";
import * as c from "../controllers/category.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { role } from "../middlewares/role.middleware.js";

const r = Router();

r.get("/", c.listCategories);
r.get("/:id", c.getCategory);

r.post("/", protect, role("admin"), c.createCategory);
r.put("/:id", protect, role("admin"), c.updateCategory);
r.delete("/:id", protect, role("admin"), c.deleteCategory);

export default r;
