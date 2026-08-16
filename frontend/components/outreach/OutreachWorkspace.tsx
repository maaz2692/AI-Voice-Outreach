"use client";

import { useState } from "react";
import ImportFilesPanel from "@/components/imports/ImportFilesPanel";
import ScriptSelector from "@/components/scripts/ScriptSelector";

export default function OutreachWorkspace() {
  const [selectedRowIds,setSelectedRowIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedScriptId,setSelectedScriptId,] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <ScriptSelector
        selectedScriptId={
          selectedScriptId
        }
        onScriptChange={
          setSelectedScriptId
        }
      />

      <ImportFilesPanel
        selectedRowIds={
          selectedRowIds
        }
        onSelectedRowIdsChange={
          setSelectedRowIds
        }
      />

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-semibold text-blue-900">
          Call setup
        </p>

        <div className="mt-3 flex flex-wrap gap-6 text-sm text-blue-800">
          <p>
            Selected contacts:{" "}
            <strong>
              {selectedRowIds.size}
            </strong>
          </p>

          <p>
            Script:{" "}
            <strong>
              {selectedScriptId
                ? "Selected"
                : "Not selected"}
            </strong>
          </p>
        </div>
      </section>
    </div>
  );
}