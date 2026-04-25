'use client';
import { Search, Bell, Menu, Briefcase, ChevronDown, Rocket, Wallet } from 'lucide-react';
import React, { useState } from 'react';

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <header className="h-14 border-b border-[#282623] bg-[#FAF9F6] flex items-center justify-between px-4 md:px-6 shrink-0 relative z-30">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-[#282623]">
          <Menu size={20} />
        </button>
        
        {/* MULTI-TENANT GATEWAY */}
        <div className="flex items-center group relative cursor-pointer border-r border-l border-[#282623] h-14 px-4 bg-[#282623] text-[#FAF9F6] hover:bg-[#BC6C25] transition-colors min-w-[220px]">
          <Briefcase size={16} className="opacity-70 mr-3" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono opacity-60 uppercase tracking-widest leading-none mb-1">Active Client</span>
            <span className="text-xs font-bold leading-none">Bear Creek Ranch</span>
          </div>
          <ChevronDown size={14} className="ml-auto opacity-50" />
          
          {/* Mock Dropdown */}
          <div className="absolute top-14 left-[-1px] right-[-1px] border border-[#282623] border-t-0 bg-[#FAF9F6] text-[#282623] hidden group-hover:block shadow-2xl">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border-b border-[#282623]/20 opacity-50">Select Account</div>
            <div className="px-4 py-3 hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors border-b border-[#282623]/20 font-medium text-xs flex justify-between items-center text-[#282623]">
              Bear Creek Ranch
              <span className="text-[9px] font-mono px-1.5 py-0.5 border border-current rounded-sm">LIVE</span>
            </div>
            <div className="px-4 py-3 hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors font-medium text-xs flex justify-between items-center text-amber-800">
              Player Z E-Sports
              <span className="text-[9px] font-mono px-1.5 py-0.5 border border-current rounded-sm">STAGING</span>
            </div>
            <div className="px-4 py-3 hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors font-medium text-xs flex justify-between items-center bg-[#282623]/5 opacity-50">
              LvlUp Labs Demo
              <span className="text-[9px] font-mono px-1.5 py-0.5 border border-current rounded-sm">DEV</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-sm w-full border border-[#282623] bg-white/50 px-3 py-1.5 focus-within:bg-white transition-colors ml-4 hidden md:flex">
          <Search size={16} className="opacity-50 text-[#282623]" />
          <input 
            type="text" 
            placeholder="Search stallions, pedigrees..." 
            className="bg-transparent border-none outline-none text-sm w-full font-mono placeholder:text-[#282623]/40 text-[#282623]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Wallet Connection */}
        <button 
          onClick={() => setIsConnected(!isConnected)}
          className={`flex items-center gap-2 border border-[#282623] px-3 py-1 text-[10px] font-mono uppercase tracking-widest font-bold transition-colors ${isConnected ? 'bg-[#D4AF37] text-[#282623]' : 'bg-white hover:bg-[#282623] hover:text-white'}`}
        >
          <Wallet size={12} />
          {isConnected ? '0x8f32...9a21' : 'Connect Wallet'}
        </button>

        {/* Environment Status Badge */}
        <div className="hidden lg:flex items-center gap-2 border border-[#606C38] bg-[#606C38]/10 text-[#606C38] px-2 py-1 text-[10px] font-mono uppercase tracking-widest font-bold">
          <Rocket size={12} />
          PROD 2.1
        </div>

        <button className="relative p-1 hover:bg-[#282623]/5 transition-colors focus:outline-none text-[#282623]">
          <Bell size={20} className="opacity-70 hover:opacity-100 transition-opacity" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full border border-[#FAF9F6]" style={{ backgroundColor: '#BC6C25' }}></span>
        </button>
        <div className="h-8 w-8 border border-[#282623] bg-[#282623] text-[#FAF9F6] flex items-center justify-center font-mono text-xs cursor-pointer hover:bg-black transition-colors">
          JD
        </div>
      </div>
    </header>
  );
}
