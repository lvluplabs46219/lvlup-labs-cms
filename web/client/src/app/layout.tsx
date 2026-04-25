import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/providers/web3-provider";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LvlUp Labs",
  description: "Bear Creek Equine & PerformAir Aviation MRO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Web3Provider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
