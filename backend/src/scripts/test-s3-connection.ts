import "dotenv/config";
import { GetBucketLocationCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/S3";

async function testS3Connection() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME is missing in file");
  }

  try {
    const command = new GetBucketLocationCommand({
      Bucket: bucketName,
    });

    const response = await s3Client.send(command);

    console.log("S3 connection successful");
    console.log(`Bucket: ${bucketName}`);
    console.log(
      `Region: ${response.LocationConstraint ?? "us-east-1"}`
    );
  } catch (error) {
    console.error("S3 connection failed");
    console.error(error);

    process.exit(1);
  }
}

testS3Connection();