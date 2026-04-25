'use client';

import { ReactNode } from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export type PlaceholderPageProps = {
  /** Section label, e.g. "Posts" */
  title: string;
  /** Path the page is mounted on, e.g. "/content/posts" */
  route: string;
  /** Where in the explorer/menu this lives, e.g. "Content > Posts" */
  breadcrumb: string;
  /** One-line CMS purpose */
  purpose: string;
  /** Longer description of what a typical CMS does here */
  description: string;
  /** Bullet list of features you'd find on this screen in a real CMS */
  typicalFeatures: string[];
  /** Optional icon shown in the header */
  icon?: ReactNode;
};

/**
 * Stub page used while the CMS is being scaffolded.
 * Each route renders this with a description of what the page is FOR
 * in a typical CMS, so navigation works end-to-end without real data.
 */
export default function PlaceholderPage({
  title,
  route,
  breadcrumb,
  purpose,
  description,
  typicalFeatures,
  icon,
}: PlaceholderPageProps) {
  return (
    <div className="p-6 font-mono text-[#cccccc] space-y-6 max-w-[1200px]">
      {/* JSDoc-style header to match dashboard aesthetic */}
      <div className="text-[#6a9955] text-[13px] leading-loose select-none">
        <div>{'/**'}</div>
        <div>
          &nbsp;{'* @page    '}
          <span className="text-[#4ec9b0]">{title}</span>
        </div>
        <div>
          &nbsp;{'* @route   '}
          <span className="text-[#ce9178]">{route}</span>
        </div>
        <div>
          &nbsp;{'* @status  '}
          <span className="text-[#dcdcaa]">placeholder</span>
        </div>
        <div>&nbsp;{'*/'}</div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#858585]">
        {breadcrumb.split('>').map((seg, i, arr) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className={i === arr.length - 1 ? 'text-[#cccccc]' : ''}>
              {seg.trim()}
            </span>
            {i < arr.length - 1 && <ChevronRight size={12} />}
          </span>
        ))}
      </div>

      {/* Title block */}
      <div className="flex items-start gap-4">
        {icon && (
          <div className="text-[#4ec9b0] mt-1 shrink-0">{icon}</div>
        )}
        <div>
          <h1 className="text-[28px] font-bold text-[#4fc3f7] leading-none mb-2 tracking-tight">
            {title}
          </h1>
          <div className="text-[13px] text-[#858585]">{purpose}</div>
        </div>
      </div>

      {/* Description card */}
      <section className="bg-[#252526] border border-[#3c3c3c] p-5">
        <div className="text-[10px] uppercase tracking-widest text-[#858585] mb-3 flex items-center gap-1.5">
          <FileText size={11} className="text-[#dcdcaa]" />
          What this page does
        </div>
        <p className="text-[13px] text-[#cccccc] leading-relaxed">
          {description}
        </p>
      </section>

      {/* Typical features */}
      <section className="bg-[#252526] border border-[#3c3c3c] p-5">
        <div className="text-[10px] uppercase tracking-widest text-[#858585] mb-4">
          Typical CMS features
        </div>
        <ul className="space-y-2 text-[13px]">
          {typicalFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[#cccccc]">
              <span className="text-[#569cd6] mt-0.5 shrink-0">{`>`}</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Empty content slot */}
      <section className="bg-[#1e1e1e] border border-dashed border-[#3c3c3c] p-12 text-center">
        <div className="text-[11px] uppercase tracking-widest text-[#858585] mb-2">
          {'<ContentSlot />'}
        </div>
        <div className="text-[12px] text-[#6a9955]">
          {`// TODO: implement ${title.toLowerCase()} UI`}
        </div>
      </section>
    </div>
  );
}
