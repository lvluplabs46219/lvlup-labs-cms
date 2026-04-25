"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import {
  FileText,
  Eye,
  Clock,
  Image,
  GitBranch,
  Globe,
  Cpu,
  Cloud,
  Zap,
  Shield,
  Lock,
  RefreshCw,
  BarChart2,
  Users,
  Package,
  ShoppingCart,
  Send,
  Layers,
  BookOpen,
  Award,
  HeadphonesIcon,
  Github,
  MessageSquare,
  Calendar,
  Wrench,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Data ──────────────────────────────────────────────────────────── */

const cmsFeatures = [
  { icon: FileText,   label: "Effortless Content Management" },
  { icon: Layers,     label: "Content Authoring Tools" },
  { icon: Eye,        label: "Split-View Editing" },
  { icon: Eye,        label: "Preview Content (real-time)" },
  { icon: Clock,      label: "Scheduled Publishing" },
  { icon: Image,      label: "Rich Media Management" },
  { icon: GitBranch,  label: "Version Control & Audit Trails" },
  { icon: Cpu,        label: "Headless & Hybrid Capabilities" },
  { icon: Zap,        label: "API-Driven Flexibility" },
  { icon: Cloud,      label: "Cloud-Ready Hosting" },
  { icon: Globe,      label: "Open-source (.NET stack)" },
  { icon: Globe,      label: "Multichannel / Multilingual / Multipurpose" },
];

const cloudFeatures = [
  { icon: RefreshCw,  label: "Automatic Upgrades & Maintenance" },
  { icon: Send,       label: "Integrated CI/CD for Continuous Delivery" },
  { icon: Layers,     label: "Streamlined Workflows" },
  { icon: Shield,     label: "Enterprise-Grade Security" },
  { icon: Lock,       label: "WAF (Web Application Firewall)" },
  { icon: Lock,       label: "Custom SSL / Certificates" },
  { icon: Globe,      label: "5 Hosting Regions" },
  { icon: Cpu,        label: "Dedicated Resource Availability" },
  { icon: FileText,   label: "Umbraco Forms (all plans)" },
  { icon: Send,       label: "Umbraco Deploy (all plans)" },
];

const cloudPricing = [
  { tier: "Free",         price: "€0",    color: "var(--text-secondary)" },
  { tier: "Starter",      price: "€45",   color: "var(--accent)" },
  { tier: "Standard",     price: "€70",   color: "var(--accent)" },
  { tier: "Professional", price: "€110",  color: "var(--accent-purple)" },
  { tier: "Enterprise",   price: "€280",  color: "var(--accent-purple)" },
  { tier: "Custom",       price: "€730+", color: "var(--accent-lime)" },
];

const heartcoreFeatures = [
  "Fully-managed APIs",
  "RESTful API + GraphQL API",
  "Cloudflare CDN global delivery",
  "Omnichannel delivery (apps, watches, speakers, screens)",
  "Managed backoffice & editor experience",
  "Content Delivery Network (CDN)",
];

const composeFeatures = [
  "Ingestion API",
  "GraphQL API with caching",
  "Webhooks for live content updates",
  "Seamless Umbraco CMS integration",
  "Cloudflare CDN",
  "Built-in AI-readiness",
  "Fully managed infrastructure",
  "Content Picker for external sources",
];

const enterpriseFeatures = [
  "Full platform bundle (all add-ons)",
  "Dedicated Cloud Hosting",
  "Priority Expert Support + 24/7",
  "Extended Long-Term Support",
  "GDPR Support + ISO27001 compliance",
  "Custom dashboards (UI Builder)",
  "Built-in AI governance tools",
  "PIM / CRM / ERP integration",
  "Dedicated Customer Success Manager",
];

const addons = [
  {
    name: "Umbraco Engage",
    icon: BarChart2,
    color: "var(--accent)",
    features: [
      "A/B Testing",
      "Personalization",
      "Server-side Analytics",
      "Goal Tracking",
      "Visitor Profiling",
      "Dashboards",
      "GDPR-compliant first-party tracking",
      "Content segmentation",
    ],
  },
  {
    name: "Umbraco Forms",
    icon: FileText,
    color: "var(--accent-lime)",
    features: [
      "Drag-drop form builder",
      "Workflows",
      "Security updates",
      "Reporting",
      "Subscription license model (v13+)",
    ],
  },
  {
    name: "Umbraco Workflow",
    icon: Layers,
    color: "var(--accent-purple)",
    features: [
      "Multi-stage approvals",
      "Granular role/permission control",
      "Customizable workflow engine",
      "Governance for large editorial teams",
    ],
  },
  {
    name: "Umbraco Commerce",
    icon: ShoppingCart,
    color: "var(--accent-lime)",
    features: [
      "Order management",
      "Multi-currency / multilingual / multi-tax",
      "Built-in analytics dashboard",
      "Payment provider APIs",
      "Sales, campaigns & loyalty",
      "Color-coded order status",
    ],
  },
  {
    name: "Umbraco Deploy",
    icon: Send,
    color: "var(--accent)",
    features: [
      "Schema + config deployments",
      "Content & media transfers",
      "Cloud and on-premises flavors",
    ],
  },
  {
    name: "Umbraco UI Builder",
    icon: Wrench,
    color: "var(--accent-purple)",
    features: [
      "Custom backoffice sections",
      "Third-party data source integration",
      "Full editing experience in a few lines of code",
    ],
  },
];

const training = [
  "On-demand video courses (developers & editors)",
  "Team training / group bookings",
  "Bundle offers (discounted certification paths)",
  "Certified Developer registry (searchable by country/org/level)",
  "Hosted at training.umbraco.com",
];

const support = [
  "Business Hours support",
  "24/5 support across timezones",
  "24/7 customized enterprise support",
  "SLA tiers with service credits",
  "Dedicated CSM (enterprise)",
];

const ecosystem = [
  { icon: Package,       label: "Umbraco Marketplace",        sub: "Packages + integrations" },
  { icon: MessageSquare, label: "Forum + Discord",             sub: "Community support" },
  { icon: Github,        label: "GitHub (open-source)",        sub: "Full source access" },
  { icon: Calendar,      label: "Codegarden",                  sub: "Annual conference" },
  { icon: Users,         label: "Partner Network",             sub: "Find / become a partner" },
  { icon: Cpu,           label: "Developer MCP Server",        sub: "Announced — AI tooling" },
  { icon: BookOpen,      label: "Knowledge Center",            sub: "Roadmap, LTS/EOL, versioning" },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */

function SectionLabel({ label, color = "var(--accent)" }: { label: string; color?: string }) {
  return (
    <p style={{
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      marginBottom: 10,
    }}>
      {label}
    </p>
  );
}

function FeaturePill({ text }: { text: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 0",
      borderBottom: "1px solid var(--border-dim)",
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
        background: "var(--accent)",
        boxShadow: "0 0 6px var(--accent)",
      }} />
      <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>{text}</span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function CmsPage() {
  return (
    <>
      <Navbar />

      <main style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1280,
        margin: "0 auto",
        padding: "48px 24px 120px",
      }}>

        {/* ── Hero ─────────────────────────────────── */}
        <motion.section
          initial="hidden" animate="visible"
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <motion.p custom={0} variants={fadeUp} style={{
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--accent)", marginBottom: 16,
          }}>
            Platform Overview
          </motion.p>

          <motion.h1 custom={1} variants={fadeUp} style={{
            fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-0.04em",
            color: "var(--text-primary)", marginBottom: 20,
          }}>
            Powered by&nbsp;
            <span className="text-accent glow-text-cyan">Umbraco CMS</span>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} style={{
            fontSize: "1rem", color: "var(--text-secondary)",
            maxWidth: 540, margin: "0 auto", lineHeight: 1.7,
          }}>
            A full breakdown of the products, features, add-ons, and ecosystem
            behind the LvlUp Labs content platform.
          </motion.p>
        </motion.section>

        {/* ── Section 1: CMS + Cloud ───────────────── */}
        <motion.h2 custom={3} variants={fadeUp} initial="hidden" animate="visible"
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}
        >
          Products &amp; Features
        </motion.h2>

        <div className="bento-grid" style={{ marginBottom: 48 }}>

          {/* Umbraco CMS card */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-6" style={{ padding: 28 }}
          >
            <SectionLabel label="Umbraco CMS" />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Core Content Management
            </h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cmsFeatures.map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 0", borderBottom: "1px solid var(--border-dim)",
                }}>
                  <Icon size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Umbraco Cloud card */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-6" style={{ padding: 28 }}
          >
            <SectionLabel label="Umbraco Cloud" color="var(--accent-purple)" />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Managed Cloud Hosting
            </h3>
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
              {cloudFeatures.map(({ icon: Icon, label }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "7px 0", borderBottom: "1px solid var(--border-dim)",
                }}>
                  <Icon size={13} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Pricing tiers */}
            <SectionLabel label="Pricing Tiers" color="var(--text-muted)" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {cloudPricing.map(({ tier, price, color }) => (
                <div key={tier} style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-dim)",
                  borderRadius: 8,
                  padding: "6px 12px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 2 }}>{tier}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color }}>{price}<span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>/mo</span></span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Heartcore card */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4" style={{ padding: 28 }}
          >
            <SectionLabel label="Umbraco Heartcore" color="var(--accent-lime)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 18, letterSpacing: "-0.02em" }}>
              Headless CMS
            </h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {heartcoreFeatures.map((f) => <FeaturePill key={f} text={f} />)}
            </div>
          </motion.div>

          {/* Compose card */}
          <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4" style={{ padding: 28 }}
          >
            <SectionLabel label="Umbraco Compose" color="var(--accent)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 18, letterSpacing: "-0.02em" }}>
              Composable DXP
            </h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {composeFeatures.map((f) => <FeaturePill key={f} text={f} />)}
            </div>
          </motion.div>

          {/* Enterprise card */}
          <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4" style={{ padding: 28, position: "relative", overflow: "hidden" }}
          >
            {/* Glow orb */}
            <div style={{
              position: "absolute", top: -50, right: -50,
              width: 180, height: 180,
              background: "radial-gradient(circle, rgba(155,93,255,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <SectionLabel label="Umbraco for Enterprise" color="var(--accent-purple)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 18, letterSpacing: "-0.02em" }}>
              Full Platform Bundle
            </h3>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {enterpriseFeatures.map((f) => <FeaturePill key={f} text={f} />)}
            </div>
          </motion.div>

        </div>

        {/* ── Section 2: Add-ons ───────────────────── */}
        <motion.h2 custom={9} variants={fadeUp} initial="hidden" animate="visible"
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}
        >
          Add-ons
        </motion.h2>

        <div className="bento-grid" style={{ marginBottom: 48 }}>
          {addons.map((addon, i) => (
            <motion.div
              key={addon.name}
              custom={10 + i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="glass glass-interactive bento-col-4"
              style={{ padding: 24 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: "rgba(0,0,0,0.3)",
                  border: `1px solid ${addon.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <addon.icon size={15} style={{ color: addon.color }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  {addon.name}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {addon.features.map((f) => (
                  <div key={f} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 0", borderBottom: "1px solid var(--border-dim)",
                  }}>
                    <span style={{
                      width: 4, height: 4, borderRadius: "50%", flexShrink: 0,
                      background: addon.color, opacity: 0.8,
                    }} />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Section 3: Training + Support + Ecosystem */}
        <motion.h2 custom={16} variants={fadeUp} initial="hidden" animate="visible"
          style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 20, letterSpacing: "-0.02em" }}
        >
          Training, Support &amp; Ecosystem
        </motion.h2>

        <div className="bento-grid">

          {/* Training */}
          <motion.div custom={17} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4" style={{ padding: 28 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <BookOpen size={16} style={{ color: "var(--accent-lime)" }} />
              <SectionLabel label="Training" color="var(--accent-lime)" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {training.map((f) => <FeaturePill key={f} text={f} />)}
            </div>
          </motion.div>

          {/* Support */}
          <motion.div custom={18} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4" style={{ padding: 28 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <HeadphonesIcon size={16} style={{ color: "var(--accent)" }} />
              <SectionLabel label="Support" color="var(--accent)" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {support.map((f) => <FeaturePill key={f} text={f} />)}
            </div>
          </motion.div>

          {/* Ecosystem */}
          <motion.div custom={19} variants={fadeUp} initial="hidden" animate="visible"
            className="glass bento-col-4" style={{ padding: 28 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Award size={16} style={{ color: "var(--accent-purple)" }} />
              <SectionLabel label="Community / Ecosystem" color="var(--accent-purple)" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ecosystem.map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-dim)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={13} style={{ color: "var(--accent-purple)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 1 }}>{label}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>
    </>
  );
}
