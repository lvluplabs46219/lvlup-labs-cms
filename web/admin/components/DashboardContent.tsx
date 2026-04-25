'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, Layers, Zap, Globe, Activity } from 'lucide-react';

const CMS_METRICS = [
  { label: 'UNIQUE VISITORS', value: '48,294', delta: '+12.4%', positive: true },
  { label: 'PUBLISHED POSTS', value: '1,284', delta: '+3 today', positive: true },
  { label: 'PENDING REVIEWS', value: '3', delta: 'needs action', positive: false },
  { label: 'BOUNCE RATE', value: '34.2%', delta: '-2.1%', positive: false },
];

const WEB3_METRICS = [
  { label: 'WALLET BALANCE', value: '4.281 ETH', delta: '≈ $14,820.40', icon: <Wallet size={12} />, glyph: '◈' },
  { label: 'TOKEN HOLDINGS', value: '12 tokens', delta: '3 NFT collections', icon: <Layers size={12} />, glyph: '◉' },
  { label: 'GAS PRICE', value: '23 Gwei', delta: '~$1.20 / tx', icon: <Zap size={12} />, glyph: '⚙' },
  { label: 'NETWORK', value: 'Ethereum', delta: 'Block #19,842,301', icon: <Globe size={12} />, glyph: '◎' },
];

const NFT_CARDS = [
  { name: 'Cosmic Drift #042', gradient: 'from-purple-600 via-pink-500 to-orange-400' },
  { name: 'Solar Flare #019', gradient: 'from-yellow-400 via-orange-500 to-red-600' },
  { name: 'Void Walker #088', gradient: 'from-blue-600 via-cyan-400 to-teal-500' },
  { name: 'Neon Pulse #003', gradient: 'from-green-400 via-emerald-500 to-cyan-600' },
];

export default function DashboardContent() {
  const [gas, setGas] = useState({ slow: 18, standard: 23, fast: 31, rapid: 45 });
  const [activeNft, setActiveNft] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setGas(prev => ({
        slow: Math.max(10, prev.slow + Math.floor((Math.random() - 0.5) * 4)),
        standard: Math.max(15, prev.standard + Math.floor((Math.random() - 0.5) * 4)),
        fast: Math.max(20, prev.fast + Math.floor((Math.random() - 0.5) * 6)),
        rapid: Math.max(30, prev.rapid + Math.floor((Math.random() - 0.5) * 8)),
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-6 font-mono text-[#cccccc] space-y-6 max-w-[1400px]">

      {/* JSDoc header */}
      <div className="text-[#6a9955] text-[13px] leading-loose select-none">
        <div>{'/**'}</div>
        <div>
          &nbsp;{'* @module '}
          <span className="text-[#4ec9b0]">CMS Dashboard</span>
          {' + Web3 Integration'}
        </div>
        <div>
          &nbsp;{'* @network '}
          <span className="text-[#ce9178]">Ethereum Mainnet</span>
          {' · 3D NFT Gallery · On-chain Activity'}
        </div>
        <div>&nbsp;{'*/'}</div>
      </div>

      {/* CMS Metrics */}
      <section>
        <div className="text-[13px] mb-3">
          <span className="text-[#569cd6]">const </span>
          <span className="text-[#dcdcaa]">cms_metrics</span>
          <span className="text-[#cccccc]"> = {'{'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CMS_METRICS.map(m => (
            <div key={m.label} className="bg-[#252526] border border-[#3c3c3c] p-4 hover:border-[#007acc] transition-colors">
              <div className="text-[10px] uppercase tracking-widest text-[#858585] mb-3">{m.label}</div>
              <div className="text-[32px] font-bold text-[#4fc3f7] leading-none mb-2 tracking-tight">{m.value}</div>
              <div className={`text-[11px] flex items-center gap-1 ${m.positive ? 'text-[#ce9178]' : 'text-[#f44747]'}`}>
                {m.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {m.delta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Web3 Metrics */}
      <section>
        <div className="text-[13px] mb-3">
          <span className="text-[#569cd6]">const </span>
          <span className="text-[#dcdcaa]">web3_metrics</span>
          <span className="text-[#cccccc]"> = {'{'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WEB3_METRICS.map(m => (
            <div key={m.label} className="bg-[#252526] border border-[#3c3c3c] p-4 hover:border-[#007acc] transition-colors relative overflow-hidden">
              <div className="absolute right-3 bottom-2 text-[48px] opacity-[0.06] select-none leading-none">{m.glyph}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#858585] mb-3 flex items-center gap-1.5">
                <span className="text-[#4ec9b0]">{m.icon}</span>
                {m.label}
              </div>
              <div className="text-[22px] font-bold text-[#4fc3f7] leading-none mb-2">{m.value}</div>
              <div className="text-[11px] text-[#858585]">{m.delta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom: NFT Gallery + Gas Tracker */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* NFT Gallery */}
        <div className="lg:col-span-2 bg-[#252526] border border-[#3c3c3c]">
          <div className="px-4 py-2 border-b border-[#3c3c3c] flex items-center gap-1 text-[12px]">
            <span className="text-[#dcdcaa]">NFT_GALLERY</span>
            <span className="text-[#858585]">.</span>
            <span className="text-[#4ec9b0]">3D_CAROUSEL</span>
          </div>
          <div className="p-5">
            <div className="text-[11px] text-[#858585] mb-4">
              {'const activeIndex = '}
              <span className="text-[#b5cea8]">{activeNft}</span>
              {' // '}
              <span className="text-[#6a9955]">{NFT_CARDS[activeNft].name}</span>
            </div>
            <div className="flex gap-4 items-center justify-center h-44">
              {NFT_CARDS.map((card, i) => (
                <button
                  key={i}
                  onClick={() => setActiveNft(i)}
                  className={`transition-all duration-300 ${i === activeNft ? 'scale-110 z-10' : 'scale-90 opacity-50 hover:opacity-75 hover:scale-95'}`}
                >
                  <div className={`w-24 h-36 bg-gradient-to-br ${card.gradient} rounded-lg shadow-2xl flex items-end p-2`}>
                    <span className="text-white text-[8px] font-bold leading-tight drop-shadow">{card.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gas Tracker */}
        <div className="bg-[#252526] border border-[#3c3c3c]">
          <div className="px-4 py-2 border-b border-[#3c3c3c] flex items-center gap-1 text-[12px]">
            <Activity size={11} className="text-[#ce9178] shrink-0" />
            <span className="ml-1 text-[#dcdcaa]">GAS_TRACKER</span>
            <span className="text-[#858585]">.</span>
            <span className="text-[#4ec9b0]">REALTIME</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <GasBox label="SLOW" value={gas.slow} sub="~3 min" color="text-[#858585]" />
            <GasBox label="STANDARD" value={gas.standard} sub="~10 sec" color="text-[#4fc3f7]" />
            <GasBox label="FAST" value={gas.fast} sub="~5 sec" color="text-[#ce9178]" />
            <GasBox label="RAPID" value={gas.rapid} sub="~1 sec" color="text-[#f44747]" />
          </div>
        </div>
      </section>
    </div>
  );
}

function GasBox({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#3c3c3c] p-3">
      <div className="text-[9px] uppercase tracking-widest text-[#858585] mb-1">{label}</div>
      <div className={`text-[22px] font-bold leading-none mb-0.5 ${color}`}>{value}</div>
      <div className="text-[9px] text-[#858585]">Gwei</div>
      <div className="text-[9px] text-[#858585] mt-1">{sub}</div>
    </div>
  );
}
