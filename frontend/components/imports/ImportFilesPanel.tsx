"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import {
  ContactImportFile,
  ContactImportFileWithRows,
} from "@/types/contact-import";

type ImportFilesPanelProps = {
  selectedRowIds: Set<string>;
  onSelectedRowIdsChange: ( rowIds: Set<string> ) => void;
};

export default function ImportFilesPanel({
  selectedRowIds,
  onSelectedRowIdsChange,
}: ImportFilesPanelProps) {
  const [files, setFiles] = useState< ContactImportFile[] >([]);
  const [selectedFile, setSelectedFile] = useState<ContactImportFileWithRows | null>( null );
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [error, setError] = useState< string | null >(null);

  useEffect(() => {
    async function loadImportFiles() {
      try {
        setIsLoadingFiles(true);
        setError(null);

        const response =await api.getContactImportFiles();
        setFiles(response.data);
      } catch (error) {
        setError(
          getErrorMessage(error)
        );
      } finally {
        setIsLoadingFiles(false);
      }
    }

    loadImportFiles();
  }, []);

  async function handleFileClick(
    importFileId: string
  ) {
    try {
      setIsLoadingRows(true);
      setError(null);

      const response = await api.getContactImportRows( importFileId );
      setSelectedFile(response.data);
      onSelectedRowIdsChange(
        new Set()
      );
    } catch (error) {
      setError(
        getErrorMessage(error)
      );
    } finally {
      setIsLoadingRows(false);
    }
  }

  function handleRowSelection(
    rowId: string
  ) {
    const nextSelection = new Set(selectedRowIds);

    if (nextSelection.has(rowId)) {
      nextSelection.delete(rowId);
    } else {
      nextSelection.add(rowId);
    }

    onSelectedRowIdsChange(
      nextSelection
    );
  }

  function handleSelectAllValid() {
    if (!selectedFile) {
      return;
    }

    const validRowIds =
      selectedFile.sheets.flatMap(
        (sheet) =>
          sheet.rows
            .filter(
              (row) => row.isValid
            )
            .map((row) => row.id)
      );

    onSelectedRowIdsChange( new Set(validRowIds));
  }

  function handleClearSelection() {
    onSelectedRowIdsChange(
      new Set()
    );
  }

  const validRows =
    selectedFile?.sheets.flatMap((sheet) =>
        sheet.rows.filter((row) => row.isValid)) ?? [];

  const allValidRowsSelected =validRows.length > 0 && validRows.every((row) =>
      selectedRowIds.has(row.id)
    );

  if (isLoadingFiles) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading imported files...
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">
            Contact Imports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select an uploaded file to
            preview its contacts.
          </p>
        </div>

        {files.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-slate-500">
              No contact files have
              been uploaded yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {files.map((file) => {
              const isActive =
                selectedFile?.id ===
                file.id;

              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() =>
                    handleFileClick(
                      file.id
                    )
                  }
                  className={`flex w-full items-center justify-between gap-6 px-6 py-4 text-left transition ${
                    isActive
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {
                        file.originalFileName
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {file.totalRows} rows
                      · {file.totalSheets}{" "}
                      sheet
                      {file.totalSheets ===
                      1
                        ? ""
                        : "s"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-600">
                      {file.fileType}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {file.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {isLoadingRows && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">
            Loading contacts...
          </p>
        </section>
      )}

      {!isLoadingRows &&
        selectedFile && (
          <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {
                    selectedFile.originalFileName
                  }
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    selectedFile.totalRows
                  }{" "}
                  imported rows ·{" "}
                  {
                    selectedRowIds.size
                  }{" "}
                  selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={
                    handleSelectAllValid
                  }
                  disabled={
                    validRows.length ===
                      0 ||
                    allValidRowsSelected
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Select All Valid
                </button>

                <button
                  type="button"
                  onClick={
                    handleClearSelection
                  }
                  disabled={
                    selectedRowIds.size ===
                    0
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="w-14 px-6 py-3">
                      <span className="sr-only">
                        Select
                      </span>
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Row
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Company
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {selectedFile.sheets.flatMap(
                    (sheet) =>
                      sheet.rows.map(
                        (row) => {
                          const isSelected =
                            selectedRowIds.has(
                              row.id
                            );

                          return (
                            <tr
                              key={
                                row.id
                              }
                              className={`transition ${
                                isSelected
                                  ? "bg-blue-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={
                                    isSelected
                                  }
                                  disabled={
                                    !row.isValid
                                  }
                                  onChange={() =>
                                    handleRowSelection(
                                      row.id
                                    )
                                  }
                                  aria-label={`Select ${
                                    row.name ||
                                    `row ${row.rowNumber}`
                                  }`}
                                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                />
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-500">
                                {
                                  row.rowNumber
                                }
                              </td>

                              <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                {row.name ||
                                  "—"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {row.phone ||
                                  "—"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {row.email ||
                                  "—"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {
                                  row.company ||
                                  "—"
                                }
                              </td>

                              <td className="px-6 py-4">
                                {row.isValid ? (
                                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                    Valid
                                  </span>
                                ) : (
                                  <div>
                                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                      Invalid
                                    </span>

                                    {row.validationError && (
                                      <p className="mt-1 text-xs text-red-500">
                                        {
                                          row.validationError
                                        }
                                      </p>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
    </div>
  );
}

function getErrorMessage(
  error: unknown
) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Failed to communicate with the backend"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}