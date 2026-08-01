import { Request, Response } from "express";
import { CreateScriptInput, scriptService } from "../services/script.service.js";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

function getSingleParam(value: unknown) {
  if (Array.isArray(value)) {
    return value[0];
  }

  if (typeof value === "string") {
    return value;
  }

  return undefined;
}

export const scriptController = {
  async createScript(req: Request, res: Response) {
    try {
      const input = req.body as CreateScriptInput;
      const script = await scriptService.createScript(input);

      return res.status(201).json({
        message: "Script created successfully",
        data: script,
      });
    } catch (error) {
      return res.status(400).json({
        message: getErrorMessage(error),
      });
    }
  },

  async getScripts(req: Request, res: Response) {
    try {
      const scripts = await scriptService.getScripts();

      return res.status(200).json({
        message: "Scripts fetched successfully",
        data: scripts,
      });
    } catch (error) {
      return res.status(500).json({
        message: getErrorMessage(error),
      });
    }
  },

  async getScriptById(req: Request, res: Response) {
    try {
      const scriptId = getSingleParam(req.params.scriptId);

      if (!scriptId) {
        return res.status(400).json({
          message: "scriptId is required",
        });
      }

      const script = await scriptService.getScriptById(scriptId);

      return res.status(200).json({
        message: "Script fetched successfully",
        data: script,
      });
    } catch (error) {
      return res.status(404).json({
        message: getErrorMessage(error),
      });
    }
  },
};