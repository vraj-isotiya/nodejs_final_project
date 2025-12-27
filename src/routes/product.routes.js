import { Router } from "express";
import * as c from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { role } from "../middlewares/role.middleware.js";
import { uploadProductImages } from "../middlewares/upload.middleware.js";

const r = Router();
r.get("/", c.listProducts);
r.post(
  "/",
  protect,
  role("admin"),
  uploadProductImages.array("images", 5),
  c.createProduct
);
r.get("/:id", c.getProduct);
r.put(
  "/:id",
  protect,
  role("admin"),
  uploadProductImages.array("images", 5),
  c.updateProduct
);
r.delete("/:id", protect, role("admin"), c.deleteProduct);
export default r;
