import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

export const deleteS3Object = async (key) => {
  if (!key) return;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    })
  );
};
