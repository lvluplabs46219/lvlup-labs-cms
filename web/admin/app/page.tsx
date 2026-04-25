import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardContent from '@/components/DashboardContent';

export default function CMSPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#1e1e1e]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#1e1e1e]">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
