import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { CommandPalette } from '@/components/CommandPalette';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'LvlUp Labs CMS',
  description: 'Enterprise Content Management System',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo.png',    type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="font-mono antialiased text-[#cccccc] bg-[#1e1e1e] min-h-screen">
        <Providers>
          <KeyboardShortcuts>
            <CommandPalette />
            {children}
          </KeyboardShortcuts>
        </Providers>
      </body>
    </html>
  );
}

