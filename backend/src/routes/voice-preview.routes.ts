import { Router } from "express";
import { voicePreviewController } from "../controllers/voice-preview.controller.js";

const router = Router();

router.post( "/preview", voicePreviewController.generatePreview );

export default router;