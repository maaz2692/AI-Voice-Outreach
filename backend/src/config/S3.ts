import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;

if(!region){
    throw new Error("Aws Region is missing");
}

export const s3Client = new S3Client({
    region,
});