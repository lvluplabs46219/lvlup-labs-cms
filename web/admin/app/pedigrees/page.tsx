import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MintingDashboard from '@/components/MintingDashboard';

export default function PedigreesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#E4E3E0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#E4E3E0]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <MintingDashboard />
        </main>
      </div>
    </div>
  );
}
