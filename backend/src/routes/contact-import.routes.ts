import { Router } from "express";
import multer from "multer";
import { contactImportController } from "../controllers/contact-import.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/contacts",
  upload.single("file"),
  contactImportController.uploadContactFile
);

router.get("/contact-files", contactImportController.getContactImportFiles);

export default router;