import "dotenv/config";
import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { s3Client } from "../config/S3";
import { getBucketName } from "../utils/helper"

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function createObjectKey(originalFileName: string) {
  const safeFileName = sanitizeFileName(originalFileName);

  const now = new Date();

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  return `imports/${year}/${month}/${randomUUID()}-${safeFileName}`;
}

export const fileStorageService = {
  async uploadImportFile(file: Express.Multer.File) {
    const bucketName = getBucketName();

    const s3Key = createObjectKey(file.originalname);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    const storedFileName =
      s3Key.split("/").pop() ?? file.originalname;

    return {
      bucketName,
      s3Key,
      storedFileName,
    };
  },

  async deleteImportFile(s3Key: string) {
    const bucketName = getBucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    await s3Client.send(command);
  },
};