"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 24px 96px",
        }}
      >
        {/* ── Hero ───────────────────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <motion.p
            custom={0}
            variants={fadeUp}
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 16,
            }}
          >
            On-Chain Provenance Platform
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
              marginBottom: 24,
            }}
          >
            Verify What Matters.
            <br />
            <span className="text-accent glow-text-cyan">On-Chain.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Bear Creek horses and PerformAir aviation parts — every document,
            every pedigree, every cert anchored to an immutable proof.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/horses" className="btn-primary">
              Browse Horses <ArrowRight size={15} />
            </Link>
            <Link href="/parts" className="btn-ghost">
              Parts Catalog
            </Link>
          </motion.div>
        </motion.section>

        {/* ── Bento Grid ─────────────────────────── */}
        <div className="bento-grid">

          {/* Bear Creek — wide hero card */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="glass glass-interactive bento-col-8"
            style={{ padding: 32, minHeight: 280, position: "relative", overflow: "hidden" }}
          >
            {/* Glow orb */}
            <div style={{
              position: "absolute", top: -60, right: -60,
              width: 260, height: 260,
              background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
              Bear Creek Equine
            </p>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 12, letterSpacing: "-0.03em" }}>
              Pedigree&nbsp;&amp;&nbsp;NFT Ownership
            </h2>
            <p className="text-secondary" style={{ fontSize: "0.9rem", lineHeight: 1.65, maxWidth: 440, marginBottom: 24 }}>
              Every horse registered with a four-layer provenance chain — CMS record,
              IPFS document proof, SHA-256 hash, and an NFT token on mainnet.
            </p>
            <Link href="/horses" className="btn-ghost" style={{ width: "fit-content" }}>
              View Horses <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Stat stack */}
          <motion.div
            custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4"
            style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div className="stat-chip">
              <span className="stat-chip__value text-accent">100%</span>
              <span className="stat-chip__label">On-Chain Verified</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip__value">2</span>
              <span className="stat-chip__label">Domains Supported</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip__value text-accent-purple">NFT</span>
              <span className="stat-chip__label">Mintable Certificates</span>
            </div>
          </motion.div>

          {/* PerformAir card */}
          <motion.div
            custom={6} variants={fadeUp} initial="hidden" animate="visible"
            className="glass glass-interactive bento-col-6"
            style={{ padding: 32, minHeight: 240, position: "relative", overflow: "hidden" }}
          >
            <div style={{
              position: "absolute", bottom: -40, left: -40,
              width: 200, height: 200,
              background: "radial-gradient(circle, rgba(163,255,71,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-lime)", marginBottom: 12 }}>
              PerformAir MRO
            </p>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 10, letterSpacing: "-0.03em" }}>
              Aviation Parts&nbsp;&amp;&nbsp;Traceability
            </h2>
            <p className="text-secondary" style={{ fontSize: "0.875rem", lineHeight: 1.65, maxWidth: 380, marginBottom: 24 }}>
              FAA, EASA, CAAC and DER docs — all searchable, all traceable,
              with IPFS-anchored cert proofs and instant RFQ submission.
            </p>
            <Link href="/rfq" className="btn-ghost" style={{ width: "fit-content", borderColor: "rgba(163,255,71,0.3)" }}>
              Submit RFQ <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            custom={7} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-6"
            style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}
          >
            {[
              { icon: Shield, label: "Tamper-Proof Docs", sub: "SHA-256 + IPFS CID anchoring", color: "var(--accent)" },
              { icon: Globe,  label: "Multi-Chain Ready", sub: "Mainnet, Base, Polygon, Arbitrum", color: "var(--accent-purple)" },
              { icon: Zap,    label: "AOG Fast Track",    sub: "Priority RFQ queue for AOG situations", color: "var(--accent-lime)" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: `rgba(0,0,0,0.3)`,
                  border: `1px solid ${color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: 2 }}>{label}</p>
                  <p className="text-muted" style={{ fontSize: "0.8rem" }}>{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </main>
    </>
  );
}
