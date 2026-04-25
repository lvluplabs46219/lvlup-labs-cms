'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

interface MiniEditorProps {
  initialValue: string;
  onSave: (value: string) => void;
}

export default function MiniEditor({ initialValue, onSave }: MiniEditorProps) {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | null>(null);

  const validateJson = (text: string) => {
    try {
      JSON.parse(text);
      setError(null);
      return true;
    } catch (e: any) {
      setError(e.message || 'Invalid JSON syntax');
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Real-time linting
    validateJson(newValue);
  };

  const handleSave = () => {
    if (validateJson(value)) {
      onSave(value);
    }
  };

  const insertSnippet = (snippet: string) => {
    // Basic snippet insertion. In a real editor we'd insert at cursor.
    try {
      const parsed = JSON.parse(value);
      const newObj = { ...parsed, new_color: snippet };
      const newStr = JSON.stringify(newObj, null, 2);
      setValue(newStr);
      validateJson(newStr);
    } catch(e) {
      // If broken, just append
      setValue(value + `\n// Try fixing JSON first! Snippet: ${snippet}`);
    }
  };

  return (
    <div className="border border-[#141414] bg-[#141414] flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,0.5)] font-mono text-sm max-w-3xl w-full">
      {/* Editor Header / Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#333333] bg-[#1a1a1a]">
        <div className="flex items-center gap-4 text-[#E4E3E0]">
          <span className="font-bold text-xs uppercase tracking-widest opacity-80">theme.config.json</span>
          
          {/* Macro Dropdown (Approvals) */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-[10px] bg-[#333333] hover:bg-[#444444] px-2 py-1 transition-colors">
              Insert Color Macro <ChevronDown size={12} />
            </button>
            <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-[#E4E3E0] text-[#141414] border border-[#141414] shadow-lg z-10 w-48">
              <div className="p-2 border-b border-[#141414] text-[9px] uppercase font-bold opacity-50">Pre-approved Palette</div>
              <button onClick={() => insertSnippet('"#FF6321" // LvlUp Orange')} className="w-full text-left px-3 py-2 hover:bg-[#141414] hover:text-[#E4E3E0] text-[11px] flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FF6321] border border-[#141414] inline-block"></span> LvlUp Orange
              </button>
              <button onClick={() => insertSnippet('"#00FFCC" // Cyber Teal')} className="w-full text-left px-3 py-2 hover:bg-[#141414] hover:text-[#E4E3E0] text-[11px] flex items-center gap-2">
                <span className="w-3 h-3 bg-[#00FFCC] border border-[#141414] inline-block"></span> Cyber Teal
              </button>
              <button onClick={() => insertSnippet('"#141414" // Deep Ink')} className="w-full text-left px-3 py-2 hover:bg-[#141414] hover:text-[#E4E3E0] text-[11px] flex items-center gap-2">
                <span className="w-3 h-3 bg-[#141414] border border-[#E4E3E0] inline-block"></span> Deep Ink
              </button>
            </div>
          </div>
        </div>

        <div>
          <button 
            onClick={handleSave}
            disabled={!!error}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${
              error ? 'bg-[#333333] text-gray-500 cursor-not-allowed' : 'bg-[#E4E3E0] text-[#141414] hover:bg-white'
            }`}
          >
            Commit & Save
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          className="w-full h-80 bg-transparent text-[#00ffcc] p-4 outline-none resize-none leading-relaxed spellcheck-false whitespace-pre"
          spellCheck={false}
          style={{ fontFamily: 'inherit' }}
        />
      </div>

      {/* Status Bar */}
      <div className="border-t border-[#333333] px-3 py-1 text-[10px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {error ? (
            <span className="text-[#ff4e00] flex items-center gap-1 font-bold">
              <AlertCircle size={12} /> LINT ERR: {error}
            </span>
          ) : (
            <span className="text-green-500 flex items-center gap-1">
              <CheckCircle2 size={12} /> JSON VALID
            </span>
          )}
        </div>
        <div className="opacity-50 flex gap-4 text-[#E4E3E0]">
          <span>UTF-8</span>
          <span>Scope: Theme</span>
        </div>
      </div>
    </div>
  );
}
