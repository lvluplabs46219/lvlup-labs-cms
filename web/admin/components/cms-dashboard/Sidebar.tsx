'use client';
import { LayoutDashboard, FileText, Users, Settings, Database, FolderKanban, Plus, Network, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#282623] bg-[#FAF9F6] flex flex-col hidden md:flex shrink-0 z-20 relative">
      <div className="h-14 p-4 border-b border-[#282623] flex items-center justify-between shrink-0">
        <Image src="/logo.png" alt="LvlUp Labs" width={32} height={32} className="rounded-md" />
        <span className="font-mono font-bold tracking-tight text-lg uppercase text-[#282623]">
          LvlUp CMS
        </span>
      </div>
      <div className="p-4 border-b border-[#282623] shrink-0 bg-[#FAF9F6]">
        <button className="w-full flex items-center justify-between border border-transparent bg-[#282623] text-[#FAF9F6] px-3 py-2 text-sm font-mono hover:bg-[#BC6C25] transition-colors focus:ring-2 focus:ring-[#282623] focus:outline-none focus:ring-offset-2">
          <span>NEW ENTRY</span>
          <Plus size={16} />
        </button>
      </div>
      
      <div className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest opacity-50 font-bold border-b border-[#282623] text-[#282623]">
        Ranch Command
      </div>
      <nav className="flex-1 overflow-y-auto">
        <NavItem href="/" icon={<LayoutDashboard size={18} />} label="Pulse Dashboard" active={pathname === '/'} />
        <NavItem href="/inventory" icon={<Database size={18} />} label="Inventory" count={842} />
        <NavItem href="/pedigrees" icon={<ShieldCheck size={18} />} label="Digital Pedigrees" active={pathname === '/pedigrees'} />
        <NavItem href="/rfqs" icon={<FileText size={18} />} label="Market RFQs" count={24} />
        <NavItem href="/suppliers" icon={<Users size={18} />} label="Partners" count={52} />
        <NavItem href="/compliance" icon={<FolderKanban size={18} />} label="Certificates" />
        <NavItem href="/schema" icon={<Network size={18} />} label="Nodes" active={pathname === '/schema'} />
      </nav>

      <div className="p-4 border-t border-[#282623] shrink-0 bg-[#FAF9F6]">
        <NavItem href="#" icon={<Settings size={18} />} label="Settings" />
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active, count }: { href: string, icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-4 py-3 text-sm transition-colors border-l-4 ${active ? 'border-[#BC6C25] bg-[#BC6C25]/5 font-medium text-[#282623]' : 'border-transparent hover:bg-[#282623]/5 text-[#282623]/70 hover:text-[#282623]'}`}>
      <div className="flex items-center gap-3">
        <span className={active ? 'text-[#BC6C25]' : 'opacity-70'}>{icon}</span>
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className="font-mono text-xs border border-[#282623]/30 px-1.5 py-0.5 opacity-70 bg-white">
          {count}
        </span>
      )}
    </Link>
  );
}
