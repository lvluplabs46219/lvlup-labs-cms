import { Package } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import PlaceholderPage from '@/components/PlaceholderPage';

export const metadata = { title: 'Media Library — LvlUp Labs CMS' };

export default function MediaPage() {
  return (
    <AdminShell>
      <PlaceholderPage
        title="Media Library"
        route="/media"
        breadcrumb="Media"
        purpose="Centralized asset management for images, video, and documents."
        description="Every CMS needs a single place where uploads live. The media library is where editors drop files once and reference them everywhere — posts, pages, hero banners, NFT artwork. In this build, the media library will likely back into IPFS (via Pinata) for Web3-bound assets and standard object storage for everything else."
        typicalFeatures={[
          'Drag-and-drop upload with progress bars',
          'Bulk operations: tag, move to folder, delete, replace',
          'Image editor: crop, rotate, focal point for responsive images',
          'Auto-generated alt text suggestions and metadata extraction',
          'Find-where-used (which posts/pages reference this asset)',
          'CDN URL copy + IPFS CID copy for Web3-pinned files',
        ]}
        icon={<Package size={28} />}
      />
    </AdminShell>
  );
}
