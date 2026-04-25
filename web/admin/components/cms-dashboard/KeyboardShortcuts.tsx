'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  React.useEffect(() => {
    let sequence = '';
    let timeoutId: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // Record key
      sequence += e.key.toLowerCase();

      // Clear sequence after 1 second of inactivity
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sequence = '';
      }, 1000);

      // Match sequences
      if (sequence === 'gd') {
        router.push('/');
        sequence = '';
      } else if (sequence === 'gs') {
        router.push('/schema');
        sequence = '';
      } else if (sequence === 'gt') {
        router.push('/theme');
        sequence = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [router]);

  return <>{children}</>;
}
