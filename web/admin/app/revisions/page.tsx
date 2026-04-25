import { GitBranch } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Revisions — LvlUp Labs CMS' };

export default function RevisionsPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Revisions"
        route="/revisions"
        breadcrumb="Revisions"
        purpose="Version history and rollback for every piece of content."
        description="Every save creates a snapshot. Editors can diff two versions, roll back a bad publish, or audit who changed what. WordPress calls these 'Revisions', Sanity calls them 'History', Contentful calls them 'Versions' — same primitive: an immutable log of edits attached to each document."
        typicalFeatures={[
          'Side-by-side diff view (rich text + structured fields)',
          'Filter revisions by author, date, or change type',
          'One-click restore with optional auto-draft instead of overwrite',
          'Author attribution and edit timestamps per revision',
          'Pinned revisions (mark a "known good" version)',
          'Optional retention policy: prune revisions older than N days',
        ]}
        icon={<GitBranch size={28} />}
      />
    </AdminShell>
  );
}
