import "dotenv/config";

export const getBucketName: any=()=>{
      const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME is missing in .env file");
  }

  return bucketName;
}