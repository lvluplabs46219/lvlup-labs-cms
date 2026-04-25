import { Search } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Search — LvlUp Labs CMS' };

export default function SearchPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Search"
        route="/search"
        breadcrumb="Search"
        purpose="Global content search across every collection."
        description="A unified search index that spans posts, pages, drafts, media filenames, user profiles, and (in this build) on-chain entities like NFT collections and contract addresses. In a typical CMS this is the fastest path from 'I know it exists' to 'I'm editing it' — no clicking through nested menus."
        typicalFeatures={[
          'Fuzzy match across title, slug, body, and metadata fields',
          'Faceted filters: collection type, status, author, date range',
          'Recent searches and saved queries',
          'Keyboard-first UX (⌘K command palette wired to this index)',
          'Typeahead with thumbnail previews for media results',
          'Permalink to a result so editors can share a search URL',
        ]}
        icon={<Search size={28} />}
      />
    </AdminShell>
  );
}
