"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ContactImportFile } from "@/types/contact-import";
import axios from "axios"

export default function ImportFilesPanel() {
    const [files, setFiles] = useState<ContactImportFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadImportFiles() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await api.getContactImportFiles();

                setFiles(response.data);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ||
                        "Failed to load imported files"
                    );
                } else if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Failed to load imported files");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadImportFiles();
    }, []);

    if (isLoading) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">
                    Loading imported files...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                    Failed to load imported files
                </p>

                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            </section>
        );
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-base font-semibold text-slate-900">
                    Contact Imports
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Files uploaded for contact outreach.
                </p>
            </div>

            {files.length === 0 ? (
                <div className="p-6">
                    <p className="text-sm text-slate-500">
                        No contact files have been uploaded yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between gap-6 px-6 py-4"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-900">
                                    {file.originalFileName}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {file.totalRows} rows · {file.totalSheets} sheet
                                    {file.totalSheets === 1 ? "" : "s"}
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
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}