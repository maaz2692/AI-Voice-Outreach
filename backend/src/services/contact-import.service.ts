import * as XLSX from "xlsx";
import { randomUUID } from "crypto";
import { prisma } from "../utils/prisma.js";

type SupportedImportFileType = "csv" | "xlsx";

type JsonSafeValue = string | number | boolean | null;
type JsonSafeObject = Record<string, JsonSafeValue>;

type ParsedSheet = {
  sheetName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: {
    rowNumber: number;
    name?: string;
    phone?: string;
    email?: string;
    company?: string;
    rawData: JsonSafeObject;
    isValid: boolean;
    validationError?: string;
  }[];
};

function getFileType(originalFileName: string): SupportedImportFileType {
  const lowerFileName = originalFileName.toLowerCase();

  if (lowerFileName.endsWith(".csv")) {
    return "csv";
  }

  if (lowerFileName.endsWith(".xlsx")) {
    return "xlsx";
  }

  throw new Error("Only .csv and .xlsx files are supported right now");
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function createStoredFileName(originalFileName: string) {
  const safeFileName = sanitizeFileName(originalFileName);
  return `${Date.now()}-${randomUUID()}-${safeFileName}`;
}

function normalizeKey(key: string) {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getValueFromRow(row: Record<string, unknown>, possibleKeys: string[]) {
  const normalizedPossibleKeys = possibleKeys.map(normalizeKey);

  for (const [key, value] of Object.entries(row)) {
    const normalizedRowKey = normalizeKey(key);

    if (normalizedPossibleKeys.includes(normalizedRowKey)) {
      const cleanedValue = String(value ?? "").trim();
      return cleanedValue.length > 0 ? cleanedValue : undefined;
    }
  }

  return undefined;
}

function toJsonSafeObject(row: Record<string, unknown>): JsonSafeObject {
  const safeObject: JsonSafeObject = {};

  for (const [key, value] of Object.entries(row)) {
    if (value === undefined || value === null || value === "") {
      safeObject[key] = null;
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      safeObject[key] = value;
    } else {
      safeObject[key] = String(value);
    }
  }

  return safeObject;
}

function validateImportedRow(name?: string, phone?: string) {
  const errors: string[] = [];

  if (!name) {
    errors.push("Missing name");
  }

  if (!phone) {
    errors.push("Missing phone");
  }

  return {
    isValid: errors.length === 0,
    validationError: errors.length > 0 ? errors.join(", ") : undefined,
  };
}

function parseWorkbook(buffer: Buffer): ParsedSheet[] {
  const workbook = XLSX.read(buffer, {
    type: "buffer",
  });

  const parsedSheets: ParsedSheet[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      defval: "",
      raw: false,
      blankrows: false,
    });

    const parsedRows = rows.map((row, index) => {
      const name = getValueFromRow(row, [
        "name",
        "full name",
        "candidate name",
        "contact name",
      ]);

      const phone = getValueFromRow(row, [
        "phone",
        "phone number",
        "mobile",
        "mobile number",
        "contact number",
        "number",
      ]);

      const email = getValueFromRow(row, [
        "email",
        "email address",
        "mail",
      ]);

      const company = getValueFromRow(row, [
        "company",
        "company name",
        "organization",
        "organisation",
      ]);

      const validation = validateImportedRow(name, phone);

      return {
        rowNumber: index + 2,
        name,
        phone,
        email,
        company,
        rawData: toJsonSafeObject(row),
        isValid: validation.isValid,
        validationError: validation.validationError,
      };
    });

    const validRows = parsedRows.filter((row) => row.isValid).length;
    const invalidRows = parsedRows.length - validRows;

    parsedSheets.push({
      sheetName,
      totalRows: parsedRows.length,
      validRows,
      invalidRows,
      rows: parsedRows,
    });
  }

  return parsedSheets;
}

export const contactImportService = {
  async importContactsFromFile(file: Express.Multer.File) {
    const fileType = getFileType(file.originalname);
    const storedFileName = createStoredFileName(file.originalname);

    const parsedSheets = parseWorkbook(file.buffer);

    const totalSheets = parsedSheets.length;
    const totalRows = parsedSheets.reduce((sum, sheet) => sum + sheet.totalRows, 0);

    if (totalRows === 0) {
      throw new Error("The uploaded file does not contain any contact rows");
    }

    const importFile = await prisma.$transaction(async (tx) => {
      const createdImportFile = await tx.contactImportFile.create({
        data: {
          originalFileName: file.originalname,
          storedFileName,
          fileType,
          mimeType: file.mimetype,
          fileSize: file.size,
          totalSheets,
          totalRows,
          status: "processed",
        },
      });

      for (const sheet of parsedSheets) {
        const createdSheet = await tx.contactImportSheet.create({
          data: {
            importFileId: createdImportFile.id,
            sheetName: sheet.sheetName,
            totalRows: sheet.totalRows,
            validRows: sheet.validRows,
            invalidRows: sheet.invalidRows,
          },
        });

        if (sheet.rows.length > 0) {
          await tx.contactImportRow.createMany({
            data: sheet.rows.map((row) => ({
              importSheetId: createdSheet.id,
              rowNumber: row.rowNumber,
              name: row.name,
              phone: row.phone,
              email: row.email,
              company: row.company,
              rawData: row.rawData,
              isValid: row.isValid,
              validationError: row.validationError,
            })),
          });
        }
      }

      return createdImportFile;
    });

    return {
      importFileId: importFile.id,
      originalFileName: importFile.originalFileName,
      storedFileName: importFile.storedFileName,
      fileType: importFile.fileType,
      totalSheets,
      totalRows,
      sheets: parsedSheets.map((sheet) => ({
        sheetName: sheet.sheetName,
        totalRows: sheet.totalRows,
        validRows: sheet.validRows,
        invalidRows: sheet.invalidRows,
      })),
    };
  },

  async getContactImportFiles() {
    const importFiles = await prisma.contactImportFile.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sheets: {
          select: {
            id: true,
            sheetName: true,
            totalRows: true,
            validRows: true,
            invalidRows: true,
            createdAt: true,
          },
        },
      },
    });

    return importFiles;
  },
};