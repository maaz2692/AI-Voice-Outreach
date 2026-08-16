export type ContactImportSheet = {
  id: string;
  sheetName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  createdAt: string;
};

export type ContactImportFile = {
  id: string;
  originalFileName: string;
  storedFileName: string | null;
  fileType: "csv" | "xlsx";
  mimeType: string | null;
  fileSize: number | null;
  s3Bucket: string | null;
  s3Key: string | null;
  totalSheets: number;
  totalRows: number;
  status: "uploaded" | "processing" | "processed" | "failed";
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  sheets: ContactImportSheet[];
};

export type ContactImportRow = {
  id: string;
  rowNumber: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  rawData: Record<
    string,
    string | number | boolean | null
  >;
  isValid: boolean;
  validationError: string | null;
  contactId: string | null;
  createdAt: string;
};

export type ContactImportSheetWithRows = {
  id: string;
  sheetName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: ContactImportRow[];
};

export type ContactImportFileWithRows = {
  id: string;
  originalFileName: string;
  storedFileName: string | null;
  fileType: "csv" | "xlsx";
  s3Bucket: string | null;
  s3Key: string | null;
  totalSheets: number;
  totalRows: number;
  status: "uploaded" | "processing" | "processed" | "failed";
  createdAt: string;
  sheets: ContactImportSheetWithRows[];
};

export type ContactImportFilesResponse = {
  message: string;
  data: ContactImportFile[];
};

export type ContactImportRowsResponse = {
  message: string;
  data: ContactImportFileWithRows;
};