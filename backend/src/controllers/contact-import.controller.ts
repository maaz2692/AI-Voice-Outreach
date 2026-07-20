import { Request, Response } from "express";
import { contactImportService } from "../services/contact-import.service.js";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

function parseOptionalBoolean(value: unknown) {
  if (Array.isArray(value)) {
    value = value[0];
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export const contactImportController = {
  async uploadContactFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a CSV or XLSX file using the field name 'file'",
        });
      }

      const result = await contactImportService.importContactsFromFile(req.file);

      return res.status(201).json({
        message: "Contact file imported successfully",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: getErrorMessage(error),
      });
    }
  },

  async getContactImportFiles(req: Request, res: Response) {
    try {
      const importFiles = await contactImportService.getContactImportFiles();

      return res.status(200).json({
        message: "Contact import files fetched successfully",
        data: importFiles,
      });
    } catch (error) {
      return res.status(500).json({
        message: getErrorMessage(error),
      });
    }
  },

  async getRowsByImportFile(req: Request, res: Response) {
  try {
    const importFileIdParam = req.params.importFileId;

    const importFileId = Array.isArray(importFileIdParam)
      ? importFileIdParam[0]
      : importFileIdParam;

    if (!importFileId) {
      return res.status(400).json({
        message: "importFileId is required",
      });
    }

    const result = await contactImportService.getRowsByImportFile(importFileId, {
      isValid: parseOptionalBoolean(req.query.isValid),
    });

    return res.status(200).json({
      message: "Imported rows fetched successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      message: getErrorMessage(error),
    });
  }
}
};