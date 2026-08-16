import axios from "axios";

import {
  ContactImportFilesResponse,
  ContactImportRowsResponse,
} from "@/types/contact-import";

import { ScriptsResponse } from "@/types/scripts";

const API_BASE_URL =process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is missing in frontend/.env.local"
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  async getContactImportFiles() {
    const response =
      await apiClient.get<ContactImportFilesResponse>(
        "/api/imports/contact-files"
      );

    return response.data;
  },

  async getContactImportRows(
    importFileId: string
  ) {
    const response =
      await apiClient.get<ContactImportRowsResponse>(
        `/api/imports/files/${importFileId}/rows`
      );

    return response.data;
  },

  async getScripts() {
    const response =
      await apiClient.get<ScriptsResponse>(
        "/api/scripts"
      );

    return response.data;
  },
};