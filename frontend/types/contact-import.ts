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

export type ContactImportFilesResponse = {
  message: string;
  data: ContactImportFile[];
};