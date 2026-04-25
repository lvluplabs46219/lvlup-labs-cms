import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Overview — LvlUp Labs CMS",
  description: "CMS + Web3 admin dashboard",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
