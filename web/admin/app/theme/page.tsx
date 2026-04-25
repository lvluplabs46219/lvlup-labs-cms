'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { MiniEditor } from '@/components/MiniEditor';

const INITIAL_THEME_JSON = `{
  "brand": {
    "primary_color": "#FF6321",
    "secondary_color": "#141414",
    "background": "#E4E3E0"
  },
  "typography": {
    "font_family_base": "Inter, sans-serif",
    "font_family_heading": "JetBrains Mono, monospace"
  },
  "features": {
    "enable_dark_mode_toggle": true,
    "show_tenant_switcher": true
  }
}`;

export default function ThemeEditorPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#E4E3E0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#E4E3E0]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">
           <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#141414] font-serif uppercase antialiased tracking-tighter">
                Theme Constants Editor
              </h1>
              <p className="opacity-70 font-mono text-xs mt-2 tracking-widest max-w-2xl">
                Edit the client facing theme configurations. Uses strict JSON. The compiler will prevent saves if linting fails.
                Use <kbd className="border border-[#141414]/30 px-1 py-0.5 mx-1 uppercase">CMD+K</kbd> to open Command Palette.
              </p>
           </div>
           
           <div className="flex-1">
             <MiniEditor 
               initialValue={INITIAL_THEME_JSON}
               onSave={(val) => console.log('Saved:', val)}
             />
           </div>
        </main>
      </div>
    </div>
  );
}
