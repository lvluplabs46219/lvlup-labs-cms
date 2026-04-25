import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';
import { users } from './users';

export const documents = pgTable(
  'documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id),
    type: text('type').notNull(),
    title: text('title').notNull(),
    storageUrl: text('storage_url').notNull(),
    mimeType: text('mime_type'),
    sha256: text('sha256'),
    ipfsCid: text('ipfs_cid'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('documents_organization_id_idx').on(table.organizationId),
    typeIdx: index('documents_type_idx').on(table.type),
  })
);

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
