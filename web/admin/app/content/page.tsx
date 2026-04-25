import { FolderOpen } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Content — LvlUp Labs CMS' };

export default function ContentHubPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Content"
        route="/content"
        breadcrumb="Content"
        purpose="Hub for all content collections — posts, pages, drafts, and custom types."
        description="The Content hub is the landing pad when an editor's only goal is 'find a thing to work on'. It surfaces collection counts, recently edited items across all collections, and entry points to every content type defined in the schema. Think of it as the WordPress 'Posts' menu but expanded to handle arbitrary collection types."
        typicalFeatures={[
          'Cross-collection recent activity feed',
          'Quick-create buttons for every content type',
          'Collection cards with item counts and status breakdown',
          'Pinned/favorite items per editor',
          'Stale-content warnings (last edited > N days ago)',
          'Link out to schema builder to define new types',
        ]}
        icon={<FolderOpen size={28} />}
      />
    </AdminShell>
  );
}
