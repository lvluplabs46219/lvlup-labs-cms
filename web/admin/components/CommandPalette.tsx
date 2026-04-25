'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, Database, Briefcase, Rocket, FileJson } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const run = React.useCallback((cmd: () => void) => {
    setOpen(false);
    cmd();
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center pt-[10vh] p-4"
      onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <Command
        className="w-full max-w-[600px] bg-[#252526] border border-[#3c3c3c] shadow-2xl overflow-hidden flex flex-col font-mono"
        onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
      >
        <div className="flex items-center border-b border-[#3c3c3c] px-3 bg-[#3c3c3c]">
          <span className="text-[#569cd6] text-[12px] mr-2">&gt;</span>
          <Command.Input
            autoFocus
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent py-3 outline-none text-[13px] text-[#cccccc] placeholder:text-[#858585]"
          />
          <kbd className="text-[10px] text-[#858585] border border-[#555] px-1.5 py-0.5">ESC</kbd>
        </div>

        <Command.List className="max-h-[380px] overflow-y-auto py-2">
          <Command.Empty className="py-8 text-center text-[12px] text-[#858585]">No results found.</Command.Empty>

          <CmdGroup label="Navigation">
            <CmdItem icon={<LayoutDashboard size={13} />} label="Go to Dashboard" kbd="G D" onSelect={() => run(() => router.push('/'))} />
            <CmdItem icon={<Database size={13} />} label="Go to Schema Builder" kbd="G S" onSelect={() => run(() => router.push('/schema'))} />
            <CmdItem icon={<FileJson size={13} />} label="Theme Editor" kbd="G T" onSelect={() => run(() => router.push('/theme'))} />
          </CmdGroup>

          <CmdGroup label="Tenants">
            <CmdItem icon={<Briefcase size={13} />} label="Switch · Bear Creek Ranch" onSelect={() => run(() => {})} />
            <CmdItem icon={<Briefcase size={13} />} label="Switch · Player Z E-Sports" onSelect={() => run(() => {})} />
          </CmdGroup>

          <CmdGroup label="Actions">
            <CmdItem icon={<Rocket size={13} />} label="Deploy to Staging" onSelect={() => run(() => {})} />
          </CmdGroup>
        </Command.List>

        <div className="border-t border-[#3c3c3c] px-3 py-1.5 flex items-center gap-4 text-[10px] text-[#858585]">
          <span><kbd className="border border-[#555] px-1">↑</kbd> <kbd className="border border-[#555] px-1">↓</kbd> navigate</span>
          <span><kbd className="border border-[#555] px-1">↵</kbd> select</span>
          <span className="ml-auto"><kbd className="border border-[#555] px-1">ESC</kbd> dismiss</span>
        </div>
      </Command>
    </div>
  );
}

function CmdGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={
        <span className="block px-3 py-1 text-[10px] uppercase tracking-widest text-[#569cd6] font-bold">
          {label}
        </span>
      }
    >
      {children}
    </Command.Group>
  );
}

function CmdItem({ icon, label, kbd, onSelect }: { icon: React.ReactNode; label: string; kbd?: string; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="px-3 py-2 text-[12px] flex items-center gap-2 cursor-pointer text-[#cccccc] hover:bg-[#094771] aria-selected:bg-[#094771] transition-colors"
    >
      <span className="text-[#4ec9b0]">{icon}</span>
      {label}
      {kbd && <span className="ml-auto text-[10px] text-[#858585] font-mono">{kbd}</span>}
    </Command.Item>
  );
}
