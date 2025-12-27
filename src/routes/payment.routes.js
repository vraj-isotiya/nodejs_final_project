import express, { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import {
  createPaymentIntent,
  stripeWebhook,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/intent", protect, createPaymentIntent);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
