import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import OutreachWorkspace from "@/components/outreach/OutreachWorkspace";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-[260px] min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mx-auto max-w-7xl">
            <OutreachWorkspace />
          </div>
        </main>
      </div>
    </div>
  );
}