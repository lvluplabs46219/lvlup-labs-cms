'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  React.useEffect(() => {
    let seq = '';
    let tid: NodeJS.Timeout;

    const onKey = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) return;

      seq += e.key.toLowerCase();
      clearTimeout(tid);
      tid = setTimeout(() => { seq = ''; }, 1000);

      if (seq === 'gd') { router.push('/'); seq = ''; }
      else if (seq === 'gs') { router.push('/schema'); seq = ''; }
      else if (seq === 'gt') { router.push('/theme'); seq = ''; }
    };

    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(tid); };
  }, [router]);

  return <>{children}</>;
}
