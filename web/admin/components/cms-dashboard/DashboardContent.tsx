'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Activity, Server, Clock, Database, Globe, Users, 
  Plus, FileText, FolderKanban, ShieldCheck, Zap,
  TrendingUp, AlertTriangle, Search
} from 'lucide-react';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const data = [
  { name: '10:00', requests: 400, dbLoad: 24, latency: 120 },
  { name: '10:05', requests: 300, dbLoad: 13, latency: 110 },
  { name: '10:10', requests: 200, dbLoad: 9, latency: 98 },
  { name: '10:15', requests: 278, dbLoad: 39, latency: 145 },
  { name: '10:20', requests: 189, dbLoad: 48, latency: 210 },
  { name: '10:25', requests: 239, dbLoad: 38, latency: 132 },
  { name: '10:30', requests: 349, dbLoad: 43, latency: 130 },
];

const AVIATION_EVENTS = [
  { id: 'TRACE-01', title: 'PN-8423 Traceability Verified', author: 'FAA-DER', status: 'Success', date: 'Apr 21, 2026', metrics: 'Verified' },
  { id: 'RFQ-992', title: 'SkyStream AOG Fulfillment', author: 'Ops Alpha', status: 'Syncing', date: 'Apr 21, 2026', metrics: 'In Progress' },
  { id: 'W3-MINT', title: 'Digital Pedigree Minted', author: 'LvlUp Web3', status: 'Success', date: 'Apr 20, 2026', metrics: 'On-Chain' },
  { id: 'INV-AUD', title: 'Bin 12 Cycle Count', author: 'Warehouse', status: 'Success', date: 'Apr 19, 2026', metrics: '100% Match' },
  { id: 'SYS-ERR', title: 'Upstash Rate Limit Trigger', author: 'Security', status: 'Failed', date: 'Apr 18, 2026', metrics: 'Blocked' },
];

export default function DashboardContent() {
  return (
    <div className="max-w-[1600px] mx-auto pb-12 space-y-8">
      
      {/* Header Bento Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[#282623] font-serif uppercase antialiased tracking-tighter flex items-center gap-3">
             Ranch Operations Pulse
          </h1>
          <p className="opacity-70 font-mono text-xs mt-2 uppercase tracking-widest flex items-center gap-2">
            Status: <span className="text-[#606C38] font-bold">OPTIMIZED</span> • Organization: LVLUP-01 • Active Nodes: 12
          </p>
        </div>
        <div className="flex gap-3">
           <button className="bg-[#282623] text-[#FAF9F6] px-6 py-2.5 text-xs font-mono font-bold tracking-widest hover:bg-[#BC6C25] transition-colors flex items-center gap-2">
             <Plus size={14} /> NEW PEDIGREE
           </button>
        </div>
      </div>

      {/* The Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Main Chart Card */}
        <div className="lg:col-span-3 lg:row-span-2 border border-[#282623] bg-white shadow-[4px_4px_0px_#282623] flex flex-col">
          <div className="border-b border-[#282623] p-4 flex justify-between items-center bg-[#FAF9F6]">
            <h2 className="font-serif italic text-xs uppercase tracking-widest font-bold">Stallion Market Velocity</h2>
            <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-widest font-bold">
               <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block bg-[#282623]"></span> Transfers</span>
               <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block bg-[#BC6C25]"></span> Mints</span>
            </div>
          </div>
          <div className="flex-1 h-[400px] p-6 lg:p-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#282623', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#282623', opacity: 0.5 }} />
                <Tooltip 
                  cursor={{fill: '#f5f5f5'}} 
                  contentStyle={{ backgroundColor: '#282623', color: '#FAF9F6', border: 'none', borderRadius: '0', fontSize: '11px', fontFamily: 'monospace' }} 
                  itemStyle={{ color: '#FAF9F6' }} 
                />
                <Bar dataKey="requests" fill="#282623" radius={[0, 0, 0, 0]} barSize={30} />
                <Bar dataKey="dbLoad" fill="#BC6C25" radius={[0, 0, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Console Card */}
        <div className="lg:row-span-2 border border-[#282623] bg-[#1a1a1a] shadow-[4px_4px_0px_#282623] flex flex-col text-[#FAF9F6]">
           <div className="border-b border-white/10 p-3 flex justify-between items-center bg-[#282623]">
              <h2 className="font-mono text-xs uppercase tracking-widest text-white">Live Node Audit</h2>
              <Zap size={14} className="text-[#D4AF37]" />
           </div>
           <div className="p-4 flex-1 space-y-4 font-mono text-[11px] leading-relaxed overflow-y-auto">
              <LogEntry time="08:52:12" msg="[MINT] Pedigree BC-99 minted to Arweave..." fill="text-[#D4AF37]" />
              <LogEntry time="08:45:00" msg="[DNA] Hash verification successful: 8f32...9a21" fill="text-[#606C38]" />
              <LogEntry time="08:30:22" msg="[SQL] Updated organizationId for Stallion #42" />
              <LogEntry time="08:12:01" msg="[AOG] Urgent RFQ detected from UAE Stable" fill="text-[#BC6C25]" />
              <LogEntry time="07:55:40" msg="[SYS] Daily synchronization complete" />
              <LogEntry time="07:30:00" msg="[CERT] Form-A signed by Dr. Harrison" />
           </div>
        </div>

        {/* Metric Cards - Integrated into the grid */}
        <StatCard title="Active Stallions" value="142" delta="+12 this month" icon={<TrendingUp size={16} />} />
        <StatCard title="Pending Verifications" value="28" delta="4 High Urgency" icon={<AlertTriangle size={16} />} />
        <StatCard title="Market Vol" value="$2.4M" delta="Across 12 nodes" icon={<Globe size={16} />} />
        <StatCard title="Health Rating" value="A+" delta="Verified via IPFS" icon={<ShieldCheck size={16} />} />

      </div>

      {/* Full Width Table Section */}
      <div className="border border-[#282623] bg-white shadow-[4px_4px_0px_#282623] overflow-hidden">
        <div className="border-b border-[#282623] p-4 flex justify-between items-center bg-[#FAF9F6]">
          <h2 className="font-serif italic text-xs uppercase tracking-widest text-[#282623] font-bold">Stallion Registry & Chain of Custody</h2>
          <div className="flex gap-2">
             <div className="flex items-center gap-2 border border-[#282623] px-3 py-1 bg-white">
                <Search size={14} className="opacity-40" />
                <input type="text" placeholder="FILTER BY NODE..." className="bg-transparent border-none outline-none text-[10px] font-mono w-24" />
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
                <tr className="border-b border-[#282623] bg-white">
                   <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Reg ID</th>
                   <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Identity</th>
                   <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">State</th>
                   <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Authority</th>
                   <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Maturity</th>
                   <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40 text-right">Pedigree Rank</th>
                </tr>
             </thead>
             <tbody>
                {AVIATION_EVENTS.map((item) => (
                   <tr key={item.id} className="border-b border-[#282623] hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors group cursor-pointer">
                      <td className="p-4 font-mono text-[11px] font-medium tracking-wide">[{item.id}]</td>
                      <td className="p-4">
                         <div className="font-medium text-[13px]">{item.title}</div>
                         <div className="text-[9px] font-mono opacity-40 group-hover:opacity-70 mt-1 uppercase">Block Height: 18423214</div>
                      </td>
                      <td className="p-4">
                         <span className={`text-[9px] px-2 py-0.5 font-mono uppercase tracking-widest border border-[#282623] group-hover:border-[#FAF9F6] ${
                            item.status === 'Success' ? 'bg-[#606C38] text-[#FAF9F6]' :
                            item.status === 'Syncing' ? 'bg-[#BC6C25] text-[#FAF9F6]' :
                            'bg-red-900 text-white'
                         }`}>
                            {item.status}
                         </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] opacity-60 group-hover:opacity-100">{item.author}</td>
                      <td className="p-4 font-mono text-[11px] opacity-40 group-hover:opacity-100">{item.date}</td>
                      <td className="p-4 font-mono text-[11px] text-right font-bold group-hover:text-[#D4AF37]">{item.metrics}</td>
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, delta, icon }: { title: string, value: string, delta: string, icon: React.ReactNode }) {
  return (
    <div className="border border-[#282623] bg-white p-6 shadow-[4px_4px_0px_#282623] flex flex-col justify-between group hover:bg-[#282623] transition-colors cursor-default">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold opacity-40 group-hover:text-[#FAF9F6] mb-4">
        {icon}
        {title}
      </div>
      <div className="font-sans font-bold text-4xl tracking-tighter group-hover:text-[#FAF9F6] mb-2 leading-none">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest font-mono text-[#BC6C25] group-hover:text-[#D4AF37] font-bold">
        {`// ${delta}`}
      </div>
    </div>
  );
}

function LogEntry({ time, msg, fill }: { time: string, msg: string, fill?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex gap-3 items-start border-l border-white/10 hover:bg-white/5 transition-colors p-1 -mx-2 group/log relative">
      <span className="opacity-30 shrink-0 text-[9px]">[{time}]</span>
      <span className={`flex-1 ${fill || 'opacity-70'}`} title={msg}>{msg}</span>
      <button 
        onClick={handleCopy}
        className="opacity-0 group-hover/log:opacity-100 transition-opacity p-0.5 hover:text-white shrink-0"
      >
        {copied ? <Check size={10} className="text-[#606C38]" /> : <Copy size={10} className="opacity-30" />}
      </button>
    </div>
  );
}
