import { Blocks } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Extensions — LvlUp Labs CMS' };

export default function ExtensionsPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Extensions"
        route="/extensions"
        breadcrumb="Extensions"
        purpose="Plugin marketplace and installed extension manager."
        description="The extension system is what separates a CMS from a static site builder. WordPress has plugins, Shopify has apps, Strapi has plugins, Sanity has Studio plugins — same idea: third-party (or first-party) modules that hook into the core to add features without forking the codebase."
        typicalFeatures={[
          'Browse marketplace with category filters and ratings',
          'One-click install/uninstall with version pinning',
          'Auto-update toggle per extension',
          'Compatibility checks against current CMS version',
          'Permissions screen — see exactly what each extension can access',
          'Disable/enable without uninstalling for quick A/B testing',
        ]}
        icon={<Blocks size={28} />}
      />
    </AdminShell>
  );
}
