/**
 * Single source of truth for shell navigation.
 * Sidebar, Header, breadcrumbs, and CommandPalette all read from here.
 */

import {
  Files, Search, GitBranch, Blocks, Package, Settings,
  type LucideIcon,
} from 'lucide-react';

export type ActivityItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  position: 'top' | 'bottom';
};

export const ACTIVITY_BAR: ActivityItem[] = [
  { id: 'files',      label: 'Explorer',        href: '/',           icon: Files,     position: 'top' },
  { id: 'search',     label: 'Search',          href: '/search',     icon: Search,    position: 'top' },
  { id: 'revisions',  label: 'Revisions',       href: '/revisions',  icon: GitBranch, position: 'top' },
  { id: 'extensions', label: 'Extensions',      href: '/extensions', icon: Blocks,    position: 'top' },
  { id: 'media',      label: 'Media Library',   href: '/media',      icon: Package,   position: 'bottom' },
  { id: 'settings',   label: 'Settings',        href: '/settings',   icon: Settings,  position: 'bottom' },
];

export type ExplorerItem = {
  label: string;
  href: string;
  count: string;
  /** Tailwind text color for the count badge */
  color: string;
};

export type ExplorerSection = {
  id: string;
  label: string;
  defaultOpen: boolean;
  items: ExplorerItem[];
};

export const EXPLORER_SECTIONS: ExplorerSection[] = [
  {
    id: 'content',
    label: 'Content',
    defaultOpen: true,
    items: [
      { label: 'posts',  href: '/content/posts',  count: '1,284', color: 'text-[#ce9178]' },
      { label: 'pages',  href: '/content/pages',  count: '42',    color: 'text-[#ce9178]' },
      { label: 'drafts', href: '/content/drafts', count: '18',    color: 'text-[#858585]' },
    ],
  },
  {
    id: 'web3',
    label: 'Web3',
    defaultOpen: true,
    items: [
      { label: 'nft-collections', href: '/web3/nft-collections', count: '3',    color: 'text-[#4ec9b0]' },
      { label: 'smart-contracts', href: '/web3/contracts',       count: '3',    color: 'text-[#4ec9b0]' },
      { label: 'token-holders',   href: '/web3/holders',         count: '8.4k', color: 'text-[#4ec9b0]' },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    defaultOpen: false,
    items: [
      { label: 'admin',   href: '/users/admins',  count: '4',  color: 'text-[#dcdcaa]' },
      { label: 'editors', href: '/users/editors', count: '12', color: 'text-[#dcdcaa]' },
    ],
  },
];

export type MenuItem = {
  label: string;
  href: string;
};

export const HEADER_MENU: MenuItem[] = [
  { label: 'File',    href: '/file'    },
  { label: 'Edit',    href: '/edit'    },
  { label: 'View',    href: '/view'    },
  { label: 'Content', href: '/content' },
  { label: 'Web3',    href: '/web3'    },
  { label: 'Tools',   href: '/tools'   },
  { label: 'Help',    href: '/help'    },
];

export type Tab = {
  id: string;
  label: string;
  href: string;
};

export const HEADER_TABS: Tab[] = [
  { id: 'dashboard',  label: 'dashboard.tsx',   href: '/'                     },
  { id: 'web3config', label: 'web3.config.ts',  href: '/web3/config'          },
  { id: 'nftgallery', label: 'nft-gallery.tsx', href: '/web3/nft-collections' },
  { id: 'contracts',  label: 'contracts.sol',   href: '/web3/contracts'       },
];
