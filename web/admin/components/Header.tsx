'use client';
import { useState } from 'react';

const TABS = [
  { id: 'dashboard', label: 'dashboard.tsx', modified: true },
  { id: 'web3config', label: 'web3.config.ts', modified: true },
  { id: 'nftgallery', label: 'nft-gallery.tsx', modified: true },
  { id: 'contracts', label: 'contracts.sol', modified: false },
];

const MENU_ITEMS = ['File', 'Edit', 'View', 'Content', 'Web3', 'Tools', 'Help'];

export default function Header() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="shrink-0">
      {/* VS Code Title Bar */}
      <div className="h-8 bg-[#3c3c3c] flex items-center px-3 gap-4 select-none border-b border-[#252526]">
        <span className="text-[12px] font-semibold text-[#cccccc] tracking-tight shrink-0">CMS Admin · Web3</span>
        <div className="flex items-center gap-0.5">
          {MENU_ITEMS.map(item => (
            <button
              key={item}
              className="px-2.5 py-0.5 text-[12px] text-[#cccccc] hover:bg-[#505050] rounded-sm transition-colors"
            >
              {item}
            </button>
          ))}
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

      {/* VS Code Tab Bar */}
      <div className="h-9 bg-[#2d2d2d] flex items-end border-b border-[#252526] overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 h-full text-[12px] font-mono shrink-0 border-r border-[#252526] transition-colors ${
              activeTab === tab.id
                ? 'bg-[#1e1e1e] text-[#cccccc]'
                : 'bg-[#2d2d2d] text-[#858585] hover:text-[#cccccc] hover:bg-[#2a2a2a]'
            }`}
          >
            {activeTab === tab.id && (
              <span className="absolute top-0 left-0 right-0 h-[1px] bg-[#007acc]" />
            )}
            <span className={`w-2 h-2 rounded-full shrink-0 ${tab.modified ? 'bg-[#e5c07b]' : 'bg-transparent border border-[#858585]'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Breadcrumb */}
      <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-[11px] text-[#858585] font-mono border-b border-[#2d2d2d]">
        <span>cms-web3</span>
        <span className="mx-1.5 opacity-40">&gt;</span>
        <span>src</span>
        <span className="mx-1.5 opacity-40">&gt;</span>
        <span className="text-[#cccccc]">
          {TABS.find(t => t.id === activeTab)?.label ?? 'dashboard.tsx'}
        </span>
      </div>
    </div>
  );
}
