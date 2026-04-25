import { FileText } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Posts — LvlUp Labs CMS' };

export default function PostsPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Posts"
        route="/content/posts"
        breadcrumb="Content > Posts"
        purpose="Browse, filter, and bulk-manage all posts."
        description="The Posts list is the workhorse of any CMS — a paginated, filterable table of every post in the system. From here, editors triage drafts, schedule publishes, and bulk-assign categories or authors."
        typicalFeatures={[
          'Sortable columns: title, author, status, date, views',
          'Filter chips: status (draft/published/scheduled), category, author',
          'Bulk actions: trash, restore, change status, reassign author',
          'Quick-edit row inline without leaving the list',
          'Search-as-you-type across title and excerpt',
          'Saved views (e.g. "My drafts", "Pending review")',
        ]}
        icon={<FileText size={28} />}
      />
    </AdminShell>
  );
}
