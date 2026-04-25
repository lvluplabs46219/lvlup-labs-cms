import { File } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Pages — LvlUp Labs CMS' };

export default function PagesPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Pages"
        route="/content/pages"
        breadcrumb="Content > Pages"
        purpose="Static pages — About, Contact, Pricing, Legal."
        description="Pages differ from posts in two ways: they're hierarchical (a page can have a parent) and they're not part of any feed or chronological listing. They're the structural skeleton of a site — homepage, about, contact, terms — content that doesn't have a 'date' so much as a 'place' in the IA."
        typicalFeatures={[
          'Hierarchical tree view with drag-to-reparent',
          'Slug/permalink editor with redirect-from-old-slug option',
          'Page templates (full-width, sidebar, landing)',
          'Set as homepage or 404 fallback from list',
          'Visibility toggles: public, password-protected, members-only',
          'SEO panel: meta title, description, OG image per page',
        ]}
        icon={<File size={28} />}
      />
    </AdminShell>
  );
}
