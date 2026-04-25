"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border-dim)",
        backdropFilter: "var(--blur-glass)",
        WebkitBackdropFilter: "var(--blur-glass)",
        background: "rgba(8, 8, 15, 0.75)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            LvlUp
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
              border: "1px solid var(--border-glow)",
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            LABS
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/horses" className="text-secondary" style={{ fontSize: "0.875rem", textDecoration: "none" }}>
            Horses
          </Link>
          <Link href="/parts" className="text-secondary" style={{ fontSize: "0.875rem", textDecoration: "none" }}>
            Parts
          </Link>
          <Link href="/rfq" className="text-secondary" style={{ fontSize: "0.875rem", textDecoration: "none" }}>
            RFQ
          </Link>
        </nav>

        {/* Wallet */}
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />
      </div>
    </motion.header>
  );
}
