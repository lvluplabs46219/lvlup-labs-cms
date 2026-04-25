'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, Monitor, Moon, Sun, LayoutDashboard, Database, Briefcase, Rocket, FileJson } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#141414]/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] p-4 font-mono">
      <Command 
        className="w-full max-w-[600px] border border-[#141414] bg-[#E4E3E0] shadow-2xl overflow-hidden flex flex-col"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <div className="flex items-center border-b border-[#141414] px-3 bg-white">
          <Search className="w-4 h-4 opacity-50 mr-2" />
          <Command.Input 
            autoFocus 
            placeholder="Type a command or search... (ESC to close)" 
            className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:text-[#141414]/40"
          />
        </div>
        
        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm opacity-50">No results found.</Command.Empty>

          <Command.Group heading={<span className="text-[10px] uppercase tracking-widest opacity-50 font-bold px-2 block mb-1 mt-2">Navigation</span>}>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/'))}
              className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]"
            >
              <LayoutDashboard size={14} /> Go to Dashboard
              <span className="ml-auto text-[10px] opacity-50">G D</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/schema'))}
              className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]"
            >
              <Database size={14} /> Go to Schema Builder
              <span className="ml-auto text-[10px] opacity-50">G S</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push('/theme'))}
              className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]"
            >
              <FileJson size={14} /> Theme Editor (JSON)
              <span className="ml-auto text-[10px] opacity-50">G T</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading={<span className="text-[10px] uppercase tracking-widest opacity-50 font-bold px-2 block mb-1 mt-2">Tenants</span>}>
            <Command.Item onSelect={() => runCommand(() => console.log('Switched to Bear Creek Ranch'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Briefcase size={14} /> Switch to Bear Creek Ranch
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => console.log('Switched to Player Z E-Sports'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Briefcase size={14} /> Switch to Player Z E-Sports
            </Command.Item>
          </Command.Group>

          <Command.Group heading={<span className="text-[10px] uppercase tracking-widest opacity-50 font-bold px-2 block mb-1 mt-2">Actions</span>}>
            <Command.Item onSelect={() => runCommand(() => console.log('Deploying...'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Rocket size={14} /> Deploy to Staging
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => console.log('Syncing...'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Database size={14} /> Sync S3 Assets
            </Command.Item>
          </Command.Group>
          
          <Command.Group heading={<span className="text-[10px] uppercase tracking-widest opacity-50 font-bold px-2 block mb-1 mt-2">Appearance</span>}>
            <Command.Item onSelect={() => runCommand(() => console.log('Theme: Dark'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Moon size={14} /> Dark Mode
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => console.log('Theme: Light'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Sun size={14} /> Light Mode
            </Command.Item>
            <Command.Item onSelect={() => runCommand(() => console.log('Theme: System'))} className="px-2 py-2 text-xs flex items-center gap-2 cursor-pointer hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors aria-selected:bg-[#141414] aria-selected:text-[#E4E3E0]">
              <Monitor size={14} /> System Mode
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="border-t border-[#141414] p-2 bg-[#E4E3E0] text-[10px] flex items-center justify-between opacity-60">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="border border-[#141414]/30 px-1 hover:bg-[#141414] hover:text-white cursor-pointer">↑</kbd> <kbd className="border border-[#141414]/30 px-1 hover:bg-[#141414] hover:text-white cursor-pointer">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="border border-[#141414]/30 px-1 hover:bg-[#141414] hover:text-white cursor-pointer">Enter</kbd> to select</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="border border-[#141414]/30 px-1 hover:bg-[#141414] hover:text-white cursor-pointer">ESC</kbd> to dismiss</span>
        </div>
      </Command>
    </div>
  );
}
