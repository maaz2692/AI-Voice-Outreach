import { Request, Response } from "express";
import { voicePreviewService } from "../services/voice-preview.service.js";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const voicePreviewController = {
  async     generatePreview( req: Request, res: Response ) {
    try {
      const result = await voicePreviewService.generatePreview({
          scriptId: req.body.scriptId,
        });

      return res.status(200).json({
        message: "Mock voice preview generated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: getErrorMessage(error),
      });
    }
  },
};