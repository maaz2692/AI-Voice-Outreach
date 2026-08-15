import "dotenv/config";
import { fileStorageService } from "../services/file-storage.service.js";

async function testUpload() {
  const content = Buffer.from(
    "name,phone\nTest User,+49123456789"
  );

  const mockFile = {
    fieldname: "file",
    originalname: "s3-test.csv",
    encoding: "7bit",
    mimetype: "text/csv",
    size: content.length,
    buffer: content,
  } as Express.Multer.File;

  try {
    const result =
      await fileStorageService.uploadImportFile(mockFile);

    console.log("S3 upload successful");
    console.log(result);
  } catch (error) {
    console.error("S3 upload failed");
    console.error(error);
  }
}

testUpload();