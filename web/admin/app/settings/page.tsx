import { Settings } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Settings — LvlUp Labs CMS' };

export default function SettingsPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Settings"
        route="/settings"
        breadcrumb="Settings"
        purpose="Site-wide configuration: identity, integrations, security."
        description="The catch-all admin surface. WordPress splits this across General/Reading/Writing/Permalinks/Discussion — same idea: settings too cross-cutting to live inside any one collection. Expect tabs for site identity, SMTP/email, API keys, role permissions, locale, and webhooks."
        typicalFeatures={[
          'General: site name, tagline, timezone, default locale',
          'Roles & permissions matrix (admin/editor/author/contributor)',
          'API keys and webhooks with rotate and revoke',
          'Email/SMTP configuration with test-send',
          'Backup schedule and restore point management',
          'Audit log of every settings change with diff and actor',
        ]}
        icon={<Settings size={28} />}
      />
    </AdminShell>
  );
}
