import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/s3.js";
import { v4 as uuid } from "uuid";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadProductImages = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `products/${uuid()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
