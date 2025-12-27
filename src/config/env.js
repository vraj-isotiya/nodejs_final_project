import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRE: "15m",
  REFRESH_TOKEN_EXPIRE: "7d",
  STORAGE: process.env.STORAGE || "local",
  AWS_BUCKET: process.env.AWS_BUCKET,
  AWS_REGION: process.env.AWS_REGION,
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
