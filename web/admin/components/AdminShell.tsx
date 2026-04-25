import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

type AdminShellProps = {
  children: ReactNode;
  /** Optional bg override; defaults to the VS Code editor bg. */
  bg?: string;
};

/**
 * Standard chrome for every admin route: activity bar + explorer + header + main.
 * Use on any new page so the shell stays consistent across the app.
 *
 * Existing pages (inventory, pedigrees, schema, theme) inline their own shell
 * with custom backgrounds — leave them as-is for now.
 */
export default function AdminShell({ children, bg = '#1e1e1e' }: AdminShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: bg }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0" style={{ background: bg }}>
        <Header />
        <main className="flex-1 overflow-y-auto" style={{ background: bg }}>
          {children}
        </main>
      </div>
    </div>
  );
}
