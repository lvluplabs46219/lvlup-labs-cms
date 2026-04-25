'use client';
import { Files, Search, GitBranch, Blocks, Package, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const [contentOpen, setContentOpen] = useState(true);
  const [web3Open, setWeb3Open] = useState(true);
  const [usersOpen, setUsersOpen] = useState(false);

  return (
    <div className="flex h-full shrink-0">
      {/* VS Code Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center border-r border-[#252526]">
        <ActivityIcon icon={<Files size={24} />} active />
        <ActivityIcon icon={<Search size={24} />} />
        <ActivityIcon icon={<GitBranch size={24} />} />
        <ActivityIcon icon={<Blocks size={24} />} />
        <div className="flex-1" />
        <ActivityIcon icon={<Package size={24} />} />
        <ActivityIcon icon={<Settings size={24} />} />
      </div>

      {/* Explorer Panel */}
      <aside className="w-52 bg-[#252526] flex-col shrink-0 hidden md:flex overflow-hidden border-r border-[#1e1e1e]">
        <div className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#bbbbbb] select-none border-b border-[#3c3c3c] shrink-0">
          Explorer
        </div>

        <div className="flex-1 overflow-y-auto text-[13px]">
          <SectionHeader label="Content" open={contentOpen} onToggle={() => setContentOpen(v => !v)} />
          {contentOpen && (
            <>
              <FileItem label="posts" count="1,284" color="text-[#ce9178]" />
              <FileItem label="pages" count="42" color="text-[#ce9178]" />
              <FileItem label="drafts" count="18" color="text-[#858585]" />
            </>
          )}

          <SectionHeader label="Web3" open={web3Open} onToggle={() => setWeb3Open(v => !v)} />
          {web3Open && (
            <>
              <FileItem label="nft-collections" count="3" color="text-[#4ec9b0]" />
              <FileItem label="smart-contracts" count="3" color="text-[#4ec9b0]" />
              <FileItem label="token-holders" count="8.4k" color="text-[#4ec9b0]" />
            </>
          )}

          <SectionHeader label="Users" open={usersOpen} onToggle={() => setUsersOpen(v => !v)} />
          {usersOpen && (
            <>
              <FileItem label="admin" count="4" color="text-[#dcdcaa]" />
              <FileItem label="editors" count="12" color="text-[#dcdcaa]" />
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function ActivityIcon({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`w-12 h-12 flex items-center justify-center transition-colors border-l-2 ${
      active
        ? 'text-white border-white bg-[#37373d]'
        : 'text-[#858585] hover:text-[#cccccc] border-transparent'
    }`}>
      {icon}
    </button>
  );
}

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] hover:bg-[#2a2d2e] select-none"
    >
      {open ? <ChevronDown size={12} className="shrink-0" /> : <ChevronRight size={12} className="shrink-0" />}
      {label}
    </button>
  );
}

function FileItem({ label, count, color }: { label: string; count: string; color: string }) {
  return (
    <div className="flex items-center justify-between pl-7 pr-3 py-0.5 hover:bg-[#37373d] cursor-pointer text-[#cccccc] hover:text-white">
      <span className="text-[12px] truncate">{label}</span>
      <span className={`text-[10px] font-mono shrink-0 ml-2 ${color}`}>({count})</span>
    </div>
  );
}
