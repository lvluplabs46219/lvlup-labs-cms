'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Filter, Plus, 
  ChevronDown, MoreHorizontal,
  ExternalLink, Download, FileText, ShieldCheck,
  RefreshCcw, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiGet } from '@/lib/api';

interface Horse {
  id: number;
  slug: string;
  name: string;
  registry_id: string;
  breed: string;
  color: string;
  sex: string;
  foaled_year: number;
  status: string;
  health?: string;
  cert?: string;
  location?: string;
}

export default function InventoryContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'audit'>('inventory');
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHorses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet('/api/v1/horses');
      // API returns { data: [...], meta: { ... } }
      setHorses(response.data.map((h: any) => ({
        ...h,
        // Mocking missing fields for UI parity
        health: h.status === 'active' ? 'A+' : 'B+',
        cert: 'DNA-Verified',
        location: 'Stable Alpha'
      })));
    } catch (err: any) {
      console.error('Failed to fetch horses:', err);
      setError(err.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-[#282623] pb-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-[#282623] font-serif uppercase antialiased tracking-tighter flex items-center gap-3">
            <Database size={28} className="text-[#BC6C25]" />
            Asset Management
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`font-mono text-xs uppercase tracking-widest px-3 py-1 border border-[#282623] transition-colors ${activeTab === 'inventory' ? 'bg-[#282623] text-[#FAF9F6]' : 'hover:bg-[#282623]/5'}`}
            >
              Registry
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`font-mono text-xs uppercase tracking-widest px-3 py-1 border border-[#282623] transition-colors ${activeTab === 'audit' ? 'bg-[#282623] text-[#FAF9F6]' : 'hover:bg-[#282623]/5'}`}
            >
              Quality Audit
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {activeTab === 'inventory' ? (
            <>
              <div className="flex-1 lg:w-64 relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" />
                <input 
                  type="text" 
                  placeholder="SEARCH ASSETS..."
                  className="w-full bg-white border border-[#282623] pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#BC6C25] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchHorses}
                className="border border-[#282623] px-4 py-2.5 text-xs font-mono font-bold tracking-widest hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors flex items-center gap-2"
              >
                <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} /> REFRESH
              </button>
              <button className="bg-[#282623] text-[#FAF9F6] px-6 py-2.5 text-xs font-mono font-bold tracking-widest hover:bg-[#BC6C25] transition-colors flex items-center gap-2">
                <Plus size={14} /> ADD ASSET
              </button>
            </>
          ) : (
            <button className="border border-[#282623] px-4 py-2.5 text-xs font-mono font-bold tracking-widest hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors flex items-center gap-2">
              <Download size={14} /> DOWNLOAD REPORT
            </button>
          )}
        </div>
      </motion.div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-red-800 font-mono text-xs uppercase tracking-widest">
          <AlertTriangle size={18} />
          <span>Error: {error}</span>
          <button onClick={fetchHorses} className="ml-auto underline hover:text-red-600">Retry Connection</button>
        </div>
      )}

      {activeTab === 'inventory' ? (
        <InventoryGrid searchTerm={searchTerm} horses={horses} loading={loading} />
      ) : (
        <QualityReportView />
      )}

      {/* Quick Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryWidget 
          label="Total Valuation" 
          value="$12.4M" 
          detail="Node Market Value" 
          icon={<TrendingUpIcon />} 
        />
        <SummaryWidget 
          label="DNA Verified" 
          value="98%" 
          detail="Digital Pedigree Coverage" 
          icon={<ShieldCheck size={18} />} 
          accent 
        />
        <SummaryWidget 
          label="Sync Health" 
          value={loading ? 'SYNCING...' : 'OPTIMAL'} 
          detail={loading ? 'Connecting to Rails API...' : 'Connected to Rails API'} 
          icon={<RefreshCcw size={18} className={loading ? 'animate-spin text-[#BC6C25]' : ''} />} 
        />
      </div>
    </div>
  );
}

function InventoryGrid({ searchTerm, horses, loading }: { searchTerm: string, horses: Horse[], loading: boolean }) {
  const filteredHorses = horses.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.registry_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="border border-[#282623] bg-white shadow-[4px_4px_0px_#282623] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#282623] bg-[#FAF9F6]">
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Asset ID</th>
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Stallion / Type</th>
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Operational State</th>
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Performance</th>
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Certification</th>
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40">Location</th>
              <th className="p-4 font-mono font-bold text-[10px] uppercase opacity-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282623]/10">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="p-4"><div className="h-4 bg-[#282623]/5 rounded" /></td>
                  ))}
                </tr>
              ))
            ) : filteredHorses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center font-mono text-[10px] uppercase opacity-40">
                  No assets found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredHorses.map((horse, idx) => (
                <motion.tr 
                  key={horse.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-[#FAF9F6] transition-colors group cursor-pointer"
                >
                  <td className="p-4 font-mono text-[11px] font-bold tracking-tight text-[#BC6C25]">
                    {horse.registry_id}
                  </td>
                  <td className="p-4">
                    <div className="font-serif italic font-bold text-[14px] text-[#282623]">{horse.name}</div>
                    <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">{horse.breed}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] px-2 py-0.5 font-mono uppercase font-bold tracking-widest border border-[#282623] ${
                      horse.status === 'active' ? 'bg-[#606C38] text-[#FAF9F6]' :
                      horse.status === 'Medical' ? 'bg-red-900 text-white' :
                      'bg-[#BC6C25] text-[#FAF9F6]'
                    }`}>
                      {horse.status === 'active' ? 'Available' : horse.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-12 h-1 bg-[#282623]/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${horse.health?.startsWith('A') ? 'bg-[#606C38]' : 'bg-[#D4AF37]'}`} 
                            style={{ width: horse.health === 'A+' ? '100%' : '70%' }}
                          />
                       </div>
                       <span className="font-mono text-[11px] font-bold">{horse.health}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono opacity-70 group-hover:opacity-100 transition-opacity">
                      <ShieldCheck size={12} className="text-[#606C38]" />
                      {horse.cert}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[11px] font-mono opacity-60 uppercase">{horse.location}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-[#282623] hover:text-[#FAF9F6] transition-colors border border-transparent hover:border-[#282623]">
                        <FileText size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-[#BC6C25] hover:text-[#FAF9F6] transition-colors border border-transparent hover:border-[#282623]">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-[#FAF9F6] border-t border-[#282623] flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-50">
        <div>Showing {filteredHorses.length} records</div>
        <div className="flex gap-4">
          <button className="hover:text-[#BC6C25] transition-colors flex items-center gap-1">
            <Download size={12} /> EXPORT CSV
          </button>
          <button className="hover:text-[#BC6C25] transition-colors flex items-center gap-1 text-[#282623] font-bold">
            PAGE 01 <ChevronDown size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function QualityReportView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#282623] bg-white p-6 shadow-[4px_4px_0px_#282623]">
          <h3 className="font-serif italic text-lg mb-4 text-[#BC6C25]">Nomenclature Anomaly Report</h3>
          <div className="space-y-4">
             {[
               { from: "McDonald Douglas MD80", to: "McDonnell Douglas MD-80" },
               { from: "VALVE ASSY.", to: "VALVE ASSY (Canonical)" },
               { from: "ACTUATOR ASSY.", to: "ACTUATOR ASSY (Canonical)" },
               { from: "British Aero Especial 146", to: "British Aerospace 146" }
             ].map((fix, i) => (
               <div key={i} className="flex justify-between items-center border-b border-[#282623]/10 pb-2">
                  <span className="font-mono text-xs opacity-60 italic">{fix.from}</span>
                  <span className="font-mono text-xs font-bold text-[#BC6C25] tracking-tight">→ {fix.to}</span>
               </div>
             ))}
          </div>
        </div>
        
        <div className="border border-[#282623] bg-white p-6 shadow-[4px_4px_0px_#282623]">
          <h3 className="font-serif italic text-lg mb-4 text-[#BC6C25]">ATA Code Inconsistencies</h3>
          <div className="space-y-4">
             <div className="bg-[#282623]/5 p-3 font-mono text-[10px] space-y-1 border-l-2 border-[#BC6C25]">
                <div className="flex justify-between">
                   <span className="opacity-50">Invalid ATA:</span>
                   <span className="font-bold">CE-09-13-25-16-JD</span>
                </div>
                <div className="flex justify-between">
                   <span className="opacity-50">Recommendation:</span>
                   <span className="text-[#BC6C25]">Reformat to standard XX-XX-XX pattern</span>
                </div>
             </div>
             <div className="bg-[#282623]/5 p-3 font-mono text-[10px] space-y-1 border-l-2 border-[#BC6C25]">
                <div className="flex justify-between">
                   <span className="opacity-50">Invalid ATA:</span>
                   <span className="font-bold">Short codes: 28-1-2</span>
                </div>
                <div className="flex justify-between">
                   <span className="opacity-50">Recommendation:</span>
                   <span className="text-[#BC6C25]">Padding: Include leading zeros for compliance</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="border border-[#282623] bg-[#282623] text-[#FAF9F6] p-6 shadow-[4px_4px_0px_#BC6C25]">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-serif italic text-xl uppercase tracking-tighter">Fleet Health Audit Summary</h3>
           <div className="font-mono text-xs bg-[#606C38] px-3 py-1 font-bold">96.8% COMPLIANCE RATING</div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
           <div>
              <div className="text-[10px] uppercase font-mono opacity-50 mb-1 tracking-widest">Total Data Rows</div>
              <div className="text-2xl font-bold font-serif">38,946</div>
           </div>
           <div>
              <div className="text-[10px] uppercase font-mono opacity-50 mb-1 tracking-widest">ATA Anomalies</div>
              <div className="text-2xl font-bold text-red-500 font-serif">1,245</div>
           </div>
           <div>
              <div className="text-[10px] uppercase font-mono opacity-50 mb-1 tracking-widest">Unique Nom</div>
              <div className="text-2xl font-bold font-serif">4,741</div>
           </div>
           <div>
              <div className="text-[10px] uppercase font-mono opacity-50 mb-1 tracking-widest">Post-Cleaning Target</div>
              <div className="text-2xl font-bold text-[#606C38] font-serif">37,704</div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function SummaryWidget({ label, value, detail, icon, accent }: { label: string, value: string, detail: string, icon: React.ReactNode, accent?: boolean }) {
  return (
    <div className={`p-6 border border-[#282623] shadow-[4px_4px_0px_#282623] ${accent ? 'bg-[#282623] text-[#FAF9F6]' : 'bg-white'}`}>
      <div className={`flex items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-widest mb-4 ${accent ? 'opacity-50' : 'opacity-40'}`}>
        {icon}
        {label}
      </div>
      <div className="text-3xl font-bold font-serif tracking-tighter mb-1">{value}</div>
      <div className={`text-[10px] font-mono uppercase tracking-widest ${accent ? 'opacity-40' : 'opacity-50'}`}>{detail}</div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}
