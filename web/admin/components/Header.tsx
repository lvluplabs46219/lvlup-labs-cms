'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HEADER_MENU, HEADER_TABS } from '@/lib/nav';

export default function Header() {
  const pathname = usePathname();

  // Active tab = whichever tab's href matches the current path.
  // Falls back to dashboard so the breadcrumb always renders something.
  const activeTab =
    HEADER_TABS.find(t =>
      t.href === '/' ? pathname === '/' : pathname.startsWith(t.href),
    ) ?? HEADER_TABS[0];

  return (
    <div className="shrink-0">
      {/* Title Bar */}
      <div className="h-9 bg-[#3c3c3c] flex items-center px-3 gap-4 select-none border-b border-[#252526]">
        {/* Brand: logo + label, clickable home */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="LvlUp Labs CMS — Home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={20}
            height={20}
            priority
            className="rounded-sm group-hover:opacity-90 transition-opacity"
          />
          <span className="text-[12px] font-semibold text-[#cccccc] tracking-tight group-hover:text-white transition-colors">
            LvlUp Labs CMS
            <span className="text-[#858585] font-normal"> · Web3</span>
          </span>
        </Link>

        <div className="flex items-center gap-0.5">
          {HEADER_MENU.map(item => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-2.5 py-0.5 text-[12px] rounded-sm transition-colors ${
                  active
                    ? 'bg-[#505050] text-white'
                    : 'text-[#cccccc] hover:bg-[#505050]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <span className="text-[#858585]">0x4f3a...c1d2 · Ethereum</span>
          <span className="flex items-center gap-1.5 text-[#4ec9b0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ec9b0] inline-block" />
            Connected
          </span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="h-9 bg-[#2d2d2d] flex items-end border-b border-[#252526] overflow-x-auto">
        {HEADER_TABS.map(tab => {
          const active = activeTab.id === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex items-center gap-2 px-4 h-full text-[12px] font-mono shrink-0 border-r border-[#252526] transition-colors ${
                active
                  ? 'bg-[#1e1e1e] text-[#cccccc]'
                  : 'bg-[#2d2d2d] text-[#858585] hover:text-[#cccccc] hover:bg-[#2a2a2a]'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-0 right-0 h-[1px] bg-[#007acc]" />
              )}
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  active
                    ? 'bg-[#e5c07b]'
                    : 'bg-transparent border border-[#858585]'
                }`}
              />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Breadcrumb */}
      <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-[11px] text-[#858585] font-mono border-b border-[#2d2d2d]">
        <span>cms-web3</span>
        <span className="mx-1.5 opacity-40">&gt;</span>
        <span>src</span>
        <span className="mx-1.5 opacity-40">&gt;</span>
        <span className="text-[#cccccc]">{activeTab.label}</span>
      </div>
    </div>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
