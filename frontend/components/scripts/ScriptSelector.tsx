"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { Script } from "@/types/scripts";

type ScriptSelectorProps = {
  selectedScriptId: string | null;
  onScriptChange: ( scriptId: string | null ) => void;
};

export default function ScriptSelector({
  selectedScriptId,
  onScriptChange,
}: ScriptSelectorProps) {
  const [scripts, setScripts] = useState< Script[] >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState< string | null >(null);

  useEffect(() => {
    async function loadScripts() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.getScripts();
        setScripts(response.data);
      } catch (error) {
        setError(
          getErrorMessage(error)
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadScripts();
  }, []);

  const selectedScript =
    scripts.find((script) =>
        script.id === selectedScriptId
    ) ?? null;

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading scripts...
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-base font-semibold text-slate-900">
          Call Script
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose the message that will be
          used for the selected contacts.
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {scripts.length === 0 ? (
          <p className="text-sm text-slate-500">
            No scripts have been created yet.
          </p>
        ) : (
          <>
            <label
              htmlFor="script"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Select script
            </label>

            <select
              id="script"
              value={
                selectedScriptId ?? ""
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                onScriptChange(
                  value || null
                );
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                Choose a script
              </option>

              {scripts.map((script) => (
                <option
                  key={script.id}
                  value={script.id}
                >
                  {script.title}
                </option>
              ))}
            </select>

            {selectedScript && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Script preview
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {selectedScript.content}
                </p>

                {selectedScript.voicePreviewText && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Voice preview text
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {
                        selectedScript.voicePreviewText
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Failed to load scripts"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}