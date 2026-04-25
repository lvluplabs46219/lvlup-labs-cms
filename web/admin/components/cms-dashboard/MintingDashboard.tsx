'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Upload, ChevronRight, Zap, Info, 
  Dna, FileBadge, History, Globe, ArrowUpRight,
  Plus, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MintingDashboard() {
  const [isMinting, setIsMinting] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateMint = () => {
    setIsMinting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsMinting(false), 1000);
          return 100;
        }
        return p + 10;
      });
    }, 400);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-[1600px] mx-auto pb-12 overflow-x-hidden"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#282623] pb-4 relative mt-2 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#282623] font-serif uppercase antialiased tracking-tighter flex items-center gap-3">
            <ShieldCheck size={28} className="text-[#BC6C25]" />
            Digital Pedigree Minting
          </h1>
          <p className="opacity-70 font-mono text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
            Status: <span className="px-2 py-0.5 border border-[#282623] bg-white text-[#606C38] font-bold">LIVE</span> • Network: Polygon Mainnet
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border border-[#282623] px-4 py-2 text-xs font-mono tracking-wider bg-[#FAF9F6] hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors flex items-center gap-2 text-[#282623]">
            <Globe size={14} /> Explorer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Form */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-[#282623] bg-white shadow-[4px_4px_0px_#282623]"
          >
            <div className="border-b border-[#282623] p-3 flex justify-between items-center bg-[#FAF9F6]">
              <h2 className="font-serif italic text-xs uppercase tracking-widest font-bold">Pedigree Configuration</h2>
              <span className="text-[10px] font-mono opacity-50">v1.2.0-secure</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest font-bold opacity-50">Stallion Name</label>
                  <input type="text" placeholder="SHADOW OF GOTHAM" className="w-full border border-[#282623] px-3 py-2 font-serif uppercase text-lg focus:outline-none focus:ring-1 focus:ring-[#BC6C25] transition-all bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest font-bold opacity-50">Registration ID</label>
                  <input type="text" placeholder="BCRP-2026-0042" className="w-full border border-[#282623] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#BC6C25] transition-all bg-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest font-bold opacity-50">Sire (Father)</label>
                  <input type="text" placeholder="DESERT KING" className="w-full border border-[#282623] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#BC6C25] transition-all bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-widest font-bold opacity-50">Dam (Mother)</label>
                  <input type="text" placeholder="MIDNIGHT QUEEN" className="w-full border border-[#282623] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#BC6C25] transition-all bg-transparent" />
                </div>
              </div>

              {/* Uploads Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#282623] border-dashed p-6 flex flex-col items-center justify-center text-center group hover:bg-[#BC6C25]/5 transition-colors cursor-pointer">
                  <Dna size={24} className="mb-2 opacity-50 text-[#BC6C25]" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest">DNA Certification</span>
                  <span className="text-[9px] font-mono opacity-40 mt-1 whitespace-pre">UPLOAD SECURE DNA HASH (PDF/JSON)</span>
                  <Upload size={14} className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="border border-[#282623] border-dashed p-6 flex flex-col items-center justify-center text-center group hover:bg-[#BC6C25]/5 transition-colors cursor-pointer">
                  <FileBadge size={24} className="mb-2 opacity-50 text-[#BC6C25]" />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest">Birth Certificate</span>
                  <span className="text-[9px] font-mono opacity-40 mt-1 whitespace-pre">GOVERNMENT ISSUED DOCUMENTS</span>
                  <Upload size={14} className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={simulateMint}
                  disabled={isMinting}
                  className={`w-full bg-[#282623] text-[#FAF9F6] py-4 font-mono font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${isMinting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#BC6C25] border border-[#282623]'}`}
                >
                  {isMinting ? (
                    <>
                      <Zap size={18} className="animate-pulse text-[#D4AF37]" />
                      MINTING TO POLYGON... {progress}%
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      INITIATE DOUBLE-BIND MINT
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border border-[#282623] bg-white shadow-[4px_4px_0px_#282623]"
          >
            <div className="border-b border-[#282623] p-3 bg-[#FAF9F6]">
              <h2 className="font-serif italic text-xs uppercase tracking-widest font-bold">Traceability History</h2>
            </div>
            <div className="divide-y divide-[#282623]">
              <HistoryItem date="Apr 22, 2026" event="DNA Verification Completed" status="Verified" author="GENETIC-LAB-01" />
              <HistoryItem date="Apr 18, 2026" event="Performance Rank updated to A+" status="Update" author="RANCH-OWNER" />
              <HistoryItem date="Mar 05, 2026" event="Initial Registration" status="Success" author="SYSTEM" />
            </div>
          </motion.div>
        </div>

        {/* Right Col: Preview & Stats */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-[#282623] bg-white shadow-[4px_4px_0px_#282623] overflow-hidden"
          >
            <div className="border-b border-[#282623] p-3 bg-[#FAF9F6]">
              <h2 className="font-serif italic text-xs uppercase tracking-widest font-bold">NFT Preview</h2>
            </div>
            <div className="aspect-square bg-[#0a0a0a] relative group overflow-hidden">
               {/* Mock NFT Image */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldCheck size={80} className="text-[#D4AF37] opacity-20" />
                 <div className="absolute bottom-4 left-4 right-4 font-mono text-[9px] text-[#D4AF37] opacity-50 space-y-1">
                   <div>[DNA_HASH]: 8f32...9a21</div>
                   <div>[ROOT]: 0x71...f42</div>
                 </div>
               </div>
               
               {/* QR Corner Overlay */}
               <div className="absolute top-4 right-4 w-12 h-12 bg-[#BC6C25] p-1 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                 <div className="border-2 border-[#0a0a0a] w-full h-full flex items-center justify-center">
                    <span className="text-[6px] font-bold text-[#0a0a0a]">VERIFY</span>
                 </div>
               </div>

               <div className="absolute inset-0 border-[20px] border-[#282623] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <div className="p-4 bg-[#282623] text-[#FAF9F6]">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-50 font-bold">Stallion: Shadow of Gotham</span>
                <ArrowUpRight size={14} className="opacity-50" />
              </div>
            </div>
          </motion.div>

          <div className="border border-[#282623] bg-white shadow-[4px_4px_0px_#282623] p-6 space-y-6">
            <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold opacity-50 border-b border-[#282623] pb-2">Blockchain Performance</h3>
            <div className="space-y-4">
              <MetricItem label="Gas Fee (Estimated)" value="$1.42" />
              <MetricItem label="IPFS Latency" value="142ms" />
              <MetricItem label="Verify Nodes" value="12" />
            </div>
          </div>

          <div className="bg-[#282623] text-[#FAF9F6] p-4 font-mono text-[10px] leading-relaxed relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <Info size={12} className="text-[#BC6C25]" />
              <span className="text-white uppercase font-bold tracking-widest">Double-Bind Logic</span>
            </div>
            <p className="relative z-10 opacity-70">
              The Pedigree ID is linked to the Inventory Item via CRC32 cross-check. All metadata is pinned to Arweave and IPFS using LvlUp's proprietary bridging protocol.
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#BC6C25]/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-[#BC6C25]/20 transition-all"></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function HistoryItem({ date, event, status, author }: { date: string, event: string, status: string, author: string }) {
  return (
    <div className="p-4 flex justify-between items-center hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors group cursor-pointer">
      <div className="space-y-1">
        <div className="text-[12px] font-bold">{event}</div>
        <div className="text-[9px] font-mono uppercase tracking-widest opacity-50 group-hover:opacity-100">{author} • {date}</div>
      </div>
      <div className="border border-[#282623] group-hover:border-[#FAF9F6] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest">
        {status}
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-[10px] uppercase font-mono tracking-widest opacity-50">{label}</span>
      <div className="flex-1 border-b border-[#282623] border-dotted mx-2 mb-1 opacity-20"></div>
      <span className="text-[14px] font-mono font-bold tracking-tight">{value}</span>
    </div>
  );
}
