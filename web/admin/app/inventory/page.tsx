import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import InventoryContent from '@/components/InventoryContent';

export default function InventoryPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F6]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9F6]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <InventoryContent />
        </main>
      </div>
    </div>
  );
}
