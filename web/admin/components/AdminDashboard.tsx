"use client";

import { useState } from "react";
import {
  Files, Search, GitBranch, Bug, Puzzle, Settings,
  ChevronDown, ChevronRight, CheckCircle2, AlertTriangle,
  AlertCircle, Bell, X, FileText,
  Activity, HardDrive, TrendingUp, TrendingDown,
  Globe, Terminal, ChevronLeft,
  Wallet, Cpu, Radio, ArrowUpRight,
  Link, Hash, Layers, Hexagon,
  type LucideIcon,
} from "lucide-react";

// ── VS Code dark tokens ───────────────────────────────────────────────────────
const C = {
  bg: "#1e1e1e",      sidebar: "#252526",  activity: "#333333",
  panel: "#1e1e1e",   border: "#3c3c3c",   titleBar: "#3c3c3c",
  tabActive: "#1e1e1e", tabInactive: "#2d2d2d", accent: "#007acc",
  text: "#cccccc",    dim: "#858585",      bright: "#ffffff",
  blue: "#9cdcfe",    green: "#4ec9b0",    yellow: "#e2c08d",
  orange: "#ce9178",  purple: "#c586c0",   red: "#f44747",
  cyan: "#4fc1ff",    pink: "#ff79c6",     lime: "#b5f044",
} as const;

// ── Mock data ─────────────────────────────────────────────────────────────────
const kpis = [
  { label: "Unique Visitors",   value: "48,294", delta: "+12.4%",      up: true,  color: C.blue   },
  { label: "Published Posts",   value: "1,284",  delta: "+3 today",    up: true,  color: C.green  },
  { label: "Pending Reviews",   value: "3",      delta: "needs action", up: false, color: C.yellow },
  { label: "Bounce Rate",       value: "34.2%",  delta: "-2.1%",       up: false, color: C.orange },
];

const web3kpis = [
  { label: "Wallet Balance",  value: "4.281 ETH", sub: "≈ $14,820.40",        color: C.cyan,   icon: Wallet },
  { label: "Token Holdings",  value: "12 tokens", sub: "3 NFT collections",   color: C.purple, icon: Layers },
  { label: "Gas Price",       value: "23 Gwei",   sub: "~$1.20 / tx",         color: C.lime,   icon: Cpu    },
  { label: "Network",         value: "Ethereum",  sub: "Block #19,842,301",   color: C.pink,   icon: Radio  },
];

const nftCards = [
  { name: "Cosmic Drift #042", collection: "CosmicPunks", price: "0.85 ETH", rarity: "Rare",      gradient: "linear-gradient(135deg,#7c3aed,#ec4899)", emoji: "🌌" },
  { name: "Neon Owl #117",     collection: "NightOwls",   price: "1.20 ETH", rarity: "Epic",      gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)", emoji: "🦉" },
  { name: "Rusted Titan #009", collection: "MetalHeads",  price: "2.40 ETH", rarity: "Legendary", gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", emoji: "⚙️" },
  { name: "Bloom Spirit #331", collection: "GardenDAO",   price: "0.45 ETH", rarity: "Uncommon",  gradient: "linear-gradient(135deg,#10b981,#06b6d4)", emoji: "🌸" },
  { name: "Dark Matter #007",  collection: "VoidSeries",  price: "3.10 ETH", rarity: "Legendary", gradient: "linear-gradient(135deg,#4b5563,#1f2937)", emoji: "🕳️" },
  { name: "Solar Flare #228",  collection: "AstroPass",   price: "0.62 ETH", rarity: "Rare",      gradient: "linear-gradient(135deg,#fbbf24,#f87171)", emoji: "☀️" },
];

const txFeed = [
  { hash: "0x3f8a…c19b", type: "Mint",     amount: "+1 NFT",             token: "CosmicPunks",  time: "2m",  status: "confirmed", color: C.green  },
  { hash: "0xa14c…9e02", type: "Transfer", amount: "-0.85 ETH",          token: "ETH",          time: "11m", status: "confirmed", color: C.orange },
  { hash: "0x77bd…3a1f", type: "Approve",  amount: "USDC",               token: "Uniswap v3",   time: "34m", status: "confirmed", color: C.cyan   },
  { hash: "0x9d22…bb4c", type: "Swap",     amount: "500 USDC → 0.14 ETH",token: "Uniswap",     time: "1h",  status: "confirmed", color: C.purple },
  { hash: "0x1e90…44fc", type: "Stake",    amount: "+200 $CMS",          token: "CMS DAO",      time: "2h",  status: "pending",   color: C.yellow },
];

const contractStatus = [
  { name: "ContentNFT.sol",  addr: "0x4f3a…c1d2", status: "verified",   calls: 1284, color: C.green  },
  { name: "CMSToken.sol",    addr: "0x9b21…aa7f", status: "verified",   calls: 8832, color: C.green  },
  { name: "RewardPool.sol",  addr: "0x2c10…f09b", status: "unverified", calls: 42,   color: C.yellow },
];

const recentActivity = [
  { user: "sarah.k",  action: "minted NFT",       content: "CosmicPunks #042",             time: "2m"  },
  { user: "james.l",  action: "staked",            content: "200 $CMS tokens",              time: "14m" },
  { user: "maria.g",  action: "published",         content: "Beginner's Guide to CSS Grid", time: "1h"  },
  { user: "tom.r",    action: "claimed rewards",   content: "12.4 $CMS earned",             time: "2h"  },
];

const sidebarTree = [
  { label: "CONTENT", items: ["posts (1,284)", "pages (42)", "drafts (18)"] },
  { label: "WEB3",    items: ["nft-collections (3)", "smart-contracts (3)", "token-holders (8.4k)"] },
  { label: "USERS",   items: ["editors (4)", "authors (12)", "wallet-users (341)"] },
];

const tabs = ["dashboard.tsx", "web3.config.ts", "nft-gallery.tsx", "contracts.sol"];

const rarityColor: Record<string, string> = {
  Legendary: C.pink, Epic: C.purple, Rare: C.cyan, Uncommon: C.green,
};

// ── 3D Carousel ───────────────────────────────────────────────────────────────
function NFTCarousel3D() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const count = nftCards.length;
  const theta = (2 * Math.PI) / count;
  const radius = Math.round((220 * count) / (2 * Math.PI));

  const rotate = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent((c) => (c + dir + count) % count);
    setTimeout(() => setAnimating(false), 600);
  };

  return (
    <div style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-4">
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 4 }} className="uppercase tracking-wider flex items-center gap-2">
        <Hexagon className="w-3.5 h-3.5" style={{ color: C.purple }} />
        nft_gallery.3d_carousel
      </div>
      <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 11, marginBottom: 12 }}>
        <span style={{ color: C.purple }}>const</span>{" "}
        <span style={{ color: C.blue }}>activeIndex</span>{" "}
        <span style={{ color: C.text }}>=</span>{" "}
        <span style={{ color: C.orange }}>{current}</span>{" "}
        <span style={{ color: C.dim }}>// {nftCards[current].name}</span>
      </div>

      {/* 3D scene */}
      <div className="relative flex items-center justify-center" style={{ height: 260, perspective: 900 }}>
        <div
          style={{
            width: 0, height: 0, position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateY(${-current * (360 / count)}deg)`,
            transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          {nftCards.map((card, i) => {
            const angle = i * theta * (180 / Math.PI);
            const isFront = i === current;
            return (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  position: "absolute", width: 180, height: 220, left: -90, top: -110,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transition: "all 0.3s ease", cursor: "pointer", borderRadius: 8, overflow: "hidden",
                  border: isFront ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                  boxShadow: isFront ? `0 0 24px ${C.accent}55,0 8px 32px #00000088` : "0 4px 16px #00000055",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  className="w-full h-full flex flex-col justify-between p-3"
                  style={{ background: card.gradient }}
                >
                  <div className="w-full flex-1 flex items-center justify-center rounded-md mb-2"
                    style={{ background: "rgba(0,0,0,0.3)", fontSize: 52 }}>
                    {card.emoji}
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{card.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "monospace" }}>{card.collection}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{card.price}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
                        background: "rgba(0,0,0,0.4)", color: rarityColor[card.rarity] ?? "#fff",
                        fontFamily: "monospace",
                      }}>{card.rarity}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => rotate(-1)} style={{
          position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
          background: "#333", border: `1px solid ${C.border}`, color: C.text,
          borderRadius: 4, padding: "6px 8px", zIndex: 10, cursor: "pointer",
        }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => rotate(1)} style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          background: "#333", border: `1px solid ${C.border}`, color: C.text,
          borderRadius: 4, padding: "6px 8px", zIndex: 10, cursor: "pointer",
        }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dot nav */}
      <div className="flex justify-center gap-1.5 mt-3">
        {nftCards.map((_, i) => (
          <button
            key={i} onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 18 : 6, height: 6, borderRadius: 3,
              background: i === current ? C.accent : C.border,
              transition: "all 0.3s ease", cursor: "pointer", border: "none",
            }}
          />
        ))}
      </div>

      {/* Active card detail */}
      <div style={{ marginTop: 12, padding: "8px 10px", background: C.bg, borderRadius: 4, border: `1px solid ${C.border}`, fontFamily: "monospace", fontSize: 11 }}>
        <span style={{ color: C.dim }}>{`{ `}</span>
        <span style={{ color: C.blue }}>name</span><span style={{ color: C.text }}>: </span>
        <span style={{ color: C.orange }}>&quot;{nftCards[current].name}&quot;</span>
        <span style={{ color: C.dim }}>, </span>
        <span style={{ color: C.blue }}>floor</span><span style={{ color: C.text }}>: </span>
        <span style={{ color: C.green }}>&quot;{nftCards[current].price}&quot;</span>
        <span style={{ color: C.dim }}>, </span>
        <span style={{ color: C.blue }}>rarity</span><span style={{ color: C.text }}>: </span>
        <span style={{ color: C.purple }}>&quot;{nftCards[current].rarity}&quot;</span>
        <span style={{ color: C.dim }}>{` }`}</span>
      </div>
    </div>
  );
}

// ── Web3 KPI row ──────────────────────────────────────────────────────────────
function Web3KPIs() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {web3kpis.map((k) => {
        const Icon = k.icon as LucideIcon;
        return (
          <div key={k.label} style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-3 relative overflow-hidden">
            <div style={{ position: "absolute", right: -12, top: -12, opacity: 0.07, color: k.color }}>
              <Icon style={{ width: 72, height: 72 }} />
            </div>
            <div style={{ color: C.dim, fontSize: 10, marginBottom: 6, fontFamily: "monospace" }} className="uppercase tracking-wider flex items-center gap-1.5">
              <Icon className="w-3 h-3" style={{ color: k.color }} />
              {k.label}
            </div>
            <div style={{ color: k.color, fontSize: 18, fontFamily: "monospace", fontWeight: 700 }}>{k.value}</div>
            <div style={{ color: C.dim, fontSize: 10, marginTop: 2, fontFamily: "monospace" }}>{k.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── CMS KPI row ───────────────────────────────────────────────────────────────
function CMSKPIs() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {kpis.map((k) => (
        <div key={k.label} style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-3">
          <div style={{ color: C.dim, fontSize: 10, marginBottom: 6 }} className="uppercase tracking-wider">{k.label}</div>
          <div style={{ color: k.color, fontSize: 20, fontFamily: "monospace", fontWeight: 700 }}>{k.value}</div>
          <div style={{ color: k.up ? C.green : C.red, fontSize: 10, marginTop: 3 }} className="flex items-center gap-1 font-mono">
            {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {k.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── On-chain TX feed ──────────────────────────────────────────────────────────
function TxFeed() {
  return (
    <div style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-4">
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 10 }} className="uppercase tracking-wider flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5" style={{ color: C.cyan }} />
        on_chain_activity.live
        <span style={{ background: C.green, width: 6, height: 6, borderRadius: "50%", marginLeft: 4, display: "inline-block", boxShadow: `0 0 6px ${C.green}` }} />
      </div>
      <div className="space-y-2 text-xs font-mono">
        {txFeed.map((tx, i) => (
          <div key={i} className="flex items-center gap-2" style={{ borderBottom: `1px solid ${C.border}22`, paddingBottom: 6 }}>
            <span style={{ color: C.dim, minWidth: 30 }}>[{tx.time}]</span>
            <span style={{ color: tx.status === "pending" ? C.yellow : C.green, minWidth: 12 }}>
              {tx.status === "pending" ? "⟳" : "✓"}
            </span>
            <span style={{ color: C.purple, minWidth: 60 }}>{tx.type}</span>
            <span style={{ color: tx.color, flex: 1 }}>{tx.amount}</span>
            <span style={{ color: C.dim }}>via</span>
            <span style={{ color: C.blue }}>{tx.token}</span>
            <span style={{ color: C.dim, fontFamily: "monospace" }}>{tx.hash}</span>
            <ArrowUpRight className="w-3 h-3" style={{ color: C.dim }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Smart Contracts ───────────────────────────────────────────────────────────
function Contracts() {
  return (
    <div style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-4">
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 10 }} className="uppercase tracking-wider flex items-center gap-2">
        <Hash className="w-3.5 h-3.5" style={{ color: C.yellow }} />
        smart_contracts
      </div>
      <div className="space-y-2 text-xs font-mono">
        {contractStatus.map((c, i) => (
          <div key={i} className="flex items-center gap-2 p-2" style={{ background: C.bg, borderRadius: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, boxShadow: `0 0 6px ${c.color}`, flexShrink: 0 }} />
            <span style={{ color: C.yellow, flex: 1 }}>{c.name}</span>
            <span style={{ color: C.dim }}>{c.addr}</span>
            <span style={{ color: C.dim, borderLeft: `1px solid ${C.border}`, paddingLeft: 8 }}>
              <span style={{ color: C.cyan }}>{c.calls.toLocaleString()}</span> calls
            </span>
            <span style={{ color: c.color, fontSize: 9, padding: "1px 6px", border: `1px solid ${c.color}44`, borderRadius: 10 }}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}`, color: C.dim, fontSize: 10 }}>
        <div className="flex items-center justify-between font-mono">
          <span><Link className="w-3 h-3 inline mr-1" />Network: <span style={{ color: C.cyan }}>Ethereum Mainnet</span></span>
          <span>Chain ID: <span style={{ color: C.orange }}>1</span></span>
          <span>Block: <span style={{ color: C.green }}>#19,842,301</span></span>
        </div>
      </div>
    </div>
  );
}

// ── Gas tracker ───────────────────────────────────────────────────────────────
function GasTracker() {
  const levels = [
    { label: "slow",     gwei: "18", time: "~3 min",  color: C.green  },
    { label: "standard", gwei: "23", time: "~30 sec", color: C.yellow },
    { label: "fast",     gwei: "31", time: "~10 sec", color: C.orange },
    { label: "instant",  gwei: "45", time: "<5 sec",  color: C.red    },
  ];
  return (
    <div style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-4">
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 10 }} className="uppercase tracking-wider flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5" style={{ color: C.lime }} />
        gas_tracker.realtime
      </div>
      <div className="grid grid-cols-2 gap-2">
        {levels.map((l) => (
          <div key={l.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 3 }} className="p-2 text-xs font-mono">
            <div style={{ color: C.dim, fontSize: 10 }} className="uppercase">{l.label}</div>
            <div style={{ color: l.color, fontSize: 16, fontWeight: 700 }}>{l.gwei} <span style={{ fontSize: 10 }}>Gwei</span></div>
            <div style={{ color: C.dim, fontSize: 10 }}>{l.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Activity log ──────────────────────────────────────────────────────────────
function ActivityPanel() {
  return (
    <div style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-4">
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 10 }} className="uppercase tracking-wider flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" style={{ color: C.blue }} />
        recent_activity.log
      </div>
      <div className="space-y-2 text-xs font-mono">
        {recentActivity.map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <span style={{ color: C.green }}>{a.time}</span>
            <span style={{ color: C.blue }}>{a.user}</span>
            <span style={{ color: C.dim }}>{a.action}</span>
            <span style={{ color: C.orange }} className="truncate">&quot;{a.content}&quot;</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── System Health ─────────────────────────────────────────────────────────────
function SystemHealth() {
  const updates = [
    { name: "Core v5.2.1",      status: "error",   msg: "Security patch required"   },
    { name: "Web3 Provider",    status: "ok",      msg: "Infura · 99.9% uptime"     },
    { name: "IPFS Node",        status: "ok",      msg: "Pinata · 4.2 GB pinned"    },
    { name: "SEO Plugin v3.4",  status: "warning", msg: "Update available"           },
  ];
  return (
    <div style={{ background: C.sidebar, border: `1px solid ${C.border}`, borderRadius: 4 }} className="p-4">
      <div style={{ color: C.dim, fontSize: 11, marginBottom: 10 }} className="uppercase tracking-wider flex items-center gap-2">
        <Activity className="w-3.5 h-3.5" />system_health
      </div>
      <div className="space-y-2 text-xs font-mono">
        {updates.map((u, i) => {
          const col = u.status === "error" ? C.red : u.status === "warning" ? C.yellow : C.green;
          const Icon = u.status === "error" ? AlertCircle : u.status === "warning" ? AlertTriangle : CheckCircle2;
          return (
            <div key={i} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5" style={{ color: col }} />
              <span style={{ color: col, minWidth: 130 }}>{u.name}</span>
              <span style={{ color: C.dim }}>{u.msg}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <div className="flex justify-between mb-1.5 text-xs font-mono">
          <span style={{ color: C.dim }} className="flex items-center gap-1"><HardDrive className="w-3 h-3" />Storage</span>
          <span style={{ color: C.blue }}>14.8 / 50 GB</span>
        </div>
        <div style={{ background: "#3c3c3c", borderRadius: 2, height: 4 }}>
          <div style={{ width: "29.6%", background: C.accent, height: "100%", borderRadius: 2 }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs font-mono">
          <span style={{ color: C.dim }}>IPFS: 4.2 GB pinned</span>
          <span style={{ color: C.dim }}>29.6% used</span>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function ExplorerSidebar() {
  const [open, setOpen] = useState<Record<string, boolean>>({ CONTENT: true, WEB3: true, USERS: false });

  return (
    <div style={{ background: C.sidebar, borderRight: `1px solid ${C.border}`, width: 210 }} className="flex flex-col shrink-0">
      <div style={{ color: C.dim, fontSize: 11, padding: "8px 16px 4px" }} className="uppercase font-semibold tracking-widest">Explorer</div>
      <div className="flex-1 overflow-y-auto text-xs" style={{ color: C.text }}>
        {sidebarTree.map((section) => (
          <div key={section.label}>
            <button
              onClick={() => setOpen((p) => ({ ...p, [section.label]: !p[section.label] }))}
              style={{ color: C.dim, fontSize: 11, padding: "4px 8px" }}
              className="w-full flex items-center gap-1 uppercase font-semibold hover:text-white tracking-widest"
            >
              {open[section.label] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {section.label}
            </button>
            {open[section.label] && section.items.map((item) => (
              <button key={item} style={{ paddingLeft: 28, color: C.text }} className="w-full text-left py-0.5 pr-2 hover:bg-[#2a2d2e] text-xs">
                <FileText className="w-3 h-3 inline mr-2 opacity-50" />{item}
              </button>
            ))}
          </div>
        ))}
      </div>
      {/* Wallet mini */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "8px 12px" }}>
        <div style={{ color: C.dim, fontSize: 10, marginBottom: 4 }} className="uppercase tracking-widest">Connected Wallet</div>
        <div style={{ color: C.cyan, fontSize: 11, fontFamily: "monospace" }}>0x4f3a…c1d2</div>
        <div style={{ color: C.green, fontSize: 10, fontFamily: "monospace" }}>● Ethereum Mainnet</div>
      </div>
    </div>
  );
}

// ── Activity bar ─────────────────────────────────────────────────────────────
function ActivityBar() {
  const icons = [Files, Search, GitBranch, Hexagon, Bug, Puzzle];
  return (
    <div style={{ background: C.activity, borderRight: `1px solid ${C.border}`, width: 48 }} className="flex flex-col items-center py-2 shrink-0">
      {icons.map((Icon, i) => (
        <button key={i} style={{ color: i === 0 || i === 3 ? C.bright : C.dim }} className="w-12 h-12 flex items-center justify-center relative transition-colors hover:text-white">
          <Icon className="w-5 h-5" />
          {(i === 0 || i === 3) && (
            <div style={{
              background: i === 3 ? C.purple : C.bright,
              width: 2, height: 24, position: "absolute", left: 0, borderRadius: "0 2px 2px 0",
            }} />
          )}
        </button>
      ))}
      <div className="flex-1" />
      <button style={{ color: C.dim }} className="w-12 h-12 flex items-center justify-center hover:text-white">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
const dotColor: Record<string, string> = {
  "dashboard.tsx": C.blue, "web3.config.ts": C.cyan,
  "nft-gallery.tsx": C.purple, "contracts.sol": C.yellow,
};

function TabBar({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div style={{ background: C.tabInactive, borderBottom: `1px solid ${C.border}`, height: 35 }} className="flex items-end shrink-0">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button key={tab} onClick={() => setActive(tab)}
            style={{
              background: isActive ? C.tabActive : C.tabInactive,
              borderRight: `1px solid ${C.border}`,
              borderTop: isActive ? `1px solid ${C.accent}` : "1px solid transparent",
              color: isActive ? C.bright : C.dim,
              padding: "0 14px", height: 35, fontSize: 12, whiteSpace: "nowrap",
            }}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor[tab], opacity: 0.85 }} />
            {tab}
            {isActive && <X className="w-3 h-3 opacity-40 hover:opacity-100 ml-1" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Status bar ────────────────────────────────────────────────────────────────
function StatusBar() {
  return (
    <div style={{ background: C.accent, height: 22, fontSize: 12, color: "#fff" }} className="flex items-center px-3 gap-4 shrink-0">
      <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />main</span>
      <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />1 error</span>
      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />2 warnings</span>
      <div className="flex-1" />
      <span className="flex items-center gap-1"><Hexagon className="w-3 h-3" />Web3 Connected</span>
      <span className="flex items-center gap-1" style={{ color: "#b5f044" }}>● Block #19,842,301</span>
      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />CMS Admin v5.1 + Web3</span>
      <span className="flex items-center gap-1"><Bell className="w-3 h-3" />Live</span>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard.tsx");

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", minHeight: "100vh" }} className="flex flex-col">
      {/* Title bar */}
      <div style={{ background: C.titleBar, height: 30, borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.dim }} className="flex items-center px-4 gap-6 shrink-0">
        <span style={{ color: C.bright, fontWeight: 600, fontSize: 13 }}>CMS Admin ⬡ Web3</span>
        {["File", "Edit", "View", "Content", "Web3", "Tools", "Help"].map((m) => (
          <span key={m} style={{ color: m === "Web3" ? C.cyan : undefined }} className="hover:text-white cursor-pointer transition-colors">{m}</span>
        ))}
        <div className="flex-1" />
        <span style={{ fontSize: 11 }}>0x4f3a…c1d2 · Ethereum</span>
        <span style={{ background: "#0e4f2e", color: C.green, border: `1px solid #1d7a4766`, fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "monospace" }}>
          ● Connected
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <ExplorerSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TabBar active={activeTab} setActive={setActiveTab} />

          {/* Breadcrumb */}
          <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, height: 24, fontSize: 12, color: C.dim }} className="flex items-center px-4 gap-1 shrink-0">
            <span>cms-web3</span>
            <ChevronRight className="w-3 h-3" />
            <span>src</span>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: C.bright }}>{activeTab}</span>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Code comment header */}
            <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 12 }} className="space-y-0.5">
              <div><span style={{ marginRight: 12 }}>1</span><span style={{ color: C.purple }}>/**</span></div>
              <div><span style={{ marginRight: 12 }}>2</span><span style={{ color: C.purple }}> * @module</span><span style={{ color: C.blue }}> CMS Dashboard</span><span style={{ color: C.dim }}> + Web3 Integration</span></div>
              <div><span style={{ marginRight: 12 }}>3</span><span style={{ color: C.purple }}> * @network</span><span style={{ color: C.cyan }}> Ethereum Mainnet</span><span style={{ color: C.dim }}> · 3D NFT Gallery · On-chain Activity</span></div>
              <div><span style={{ marginRight: 12 }}>4</span><span style={{ color: C.purple }}> */</span></div>
            </div>

            {/* CMS KPIs */}
            <div>
              <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: C.purple }}>const</span> <span style={{ color: C.blue }}>cms_metrics</span> <span style={{ color: C.text }}>=</span> <span style={{ color: C.orange }}>&#123;</span>
              </div>
              <CMSKPIs />
            </div>

            {/* Web3 KPIs */}
            <div>
              <div style={{ color: C.dim, fontFamily: "monospace", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: C.purple }}>const</span> <span style={{ color: C.cyan }}>web3_metrics</span> <span style={{ color: C.text }}>=</span> <span style={{ color: C.orange }}>&#123;</span>
              </div>
              <Web3KPIs />
            </div>

            {/* 3D carousel + right column */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <NFTCarousel3D />
              </div>
              <div className="space-y-4">
                <GasTracker />
                <ActivityPanel />
              </div>
            </div>

            {/* TX feed */}
            <TxFeed />

            {/* Contracts + System Health */}
            <div className="grid grid-cols-2 gap-4">
              <Contracts />
              <SystemHealth />
            </div>
          </div>

          {/* Problems panel */}
          <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, height: 100 }} className="shrink-0">
            <div style={{ background: C.sidebar, borderBottom: `1px solid ${C.border}`, height: 28, fontSize: 12 }} className="flex items-center">
              {["PROBLEMS (3)", "OUTPUT", "TERMINAL", "WEB3 CONSOLE"].map((t, i) => (
                <button key={t} style={{
                  color: i === 3 ? C.cyan : i === 0 ? C.bright : C.dim,
                  borderBottom: (i === 0 || i === 3) ? `1px solid ${i === 3 ? C.cyan : C.accent}` : "1px solid transparent",
                  padding: "0 16px", height: 28, fontSize: 12,
                }} className="hover:text-white transition-colors">{t}</button>
              ))}
              <div className="flex-1" />
              <button style={{ color: C.dim }} className="px-2 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div style={{ padding: "6px 16px", fontFamily: "monospace", fontSize: 11 }} className="space-y-1">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: C.red }} />
                <span style={{ color: C.red }}>Core v5.2.1</span>
                <span style={{ color: C.dim }}>Security patch required — update immediately</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: C.yellow }} />
                <span style={{ color: C.yellow }}>RewardPool.sol</span>
                <span style={{ color: C.dim }}>Contract not verified on Etherscan</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: C.yellow }} />
                <span style={{ color: C.yellow }}>Gas spike detected</span>
                <span style={{ color: C.dim }}>Network congestion — consider delaying non-urgent transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusBar />
    </div>
  );
}
