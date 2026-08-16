import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-[260px] min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Voice Outreach Dashboard
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                We will build the dashboard sections here step by step.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}