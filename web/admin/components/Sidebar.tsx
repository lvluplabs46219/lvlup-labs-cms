'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import {
  ACTIVITY_BAR,
  EXPLORER_SECTIONS,
  type ExplorerItem,
} from '@/lib/nav';

export default function Sidebar() {
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      EXPLORER_SECTIONS.reduce<Record<string, boolean>>((acc, s) => {
        acc[s.id] = s.defaultOpen;
        return acc;
      }, {}),
  );

  const toggle = (id: string) =>
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-full shrink-0">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center border-r border-[#252526]">
        {ACTIVITY_BAR.filter(a => a.position === 'top').map(item => (
          <ActivityIcon
            key={item.id}
            icon={item.icon}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
          />
        ))}
        <div className="flex-1" />
        {ACTIVITY_BAR.filter(a => a.position === 'bottom').map(item => (
          <ActivityIcon
            key={item.id}
            icon={item.icon}
            href={item.href}
            label={item.label}
            active={isActive(pathname, item.href)}
          />
        ))}
      </div>

      {/* Explorer Panel */}
      <aside className="w-52 bg-[#252526] flex-col shrink-0 hidden md:flex overflow-hidden border-r border-[#1e1e1e]">
        <div className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#bbbbbb] select-none border-b border-[#3c3c3c] shrink-0">
          Explorer
        </div>

        <div className="flex-1 overflow-y-auto text-[13px]">
          {EXPLORER_SECTIONS.map(section => (
            <div key={section.id}>
              <SectionHeader
                label={section.label}
                open={openSections[section.id]}
                onToggle={() => toggle(section.id)}
              />
              {openSections[section.id] &&
                section.items.map(item => (
                  <FileItem
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                  />
                ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

/** "/" only matches exactly. Sub-routes match by prefix. */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ActivityIcon({
  icon: Icon,
  href,
  label,
  active,
}: {
  icon: LucideIcon;
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={`w-12 h-12 flex items-center justify-center transition-colors border-l-2 ${
        active
          ? 'text-white border-white bg-[#37373d]'
          : 'text-[#858585] hover:text-[#cccccc] border-transparent'
      }`}
    >
      <Icon size={24} />
    </Link>
  );
}

function SectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-1 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] hover:bg-[#2a2d2e] select-none"
    >
      {open ? (
        <ChevronDown size={12} className="shrink-0" />
      ) : (
        <ChevronRight size={12} className="shrink-0" />
      )}
      {label}
    </button>
  );
}

function FileItem({
  item,
  active,
}: {
  item: ExplorerItem;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`flex items-center justify-between pl-7 pr-3 py-0.5 cursor-pointer hover:bg-[#37373d] hover:text-white ${
        active ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
      }`}
    >
      <span className="text-[12px] truncate">{item.label}</span>
      <span className={`text-[10px] font-mono shrink-0 ml-2 ${item.color}`}>
        ({item.count})
      </span>
    </Link>
  );
}
