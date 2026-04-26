import { index, jsonb, pgTable, text, timestamp, uuid } from '-orm/pg-core';

import { organizations } from './organizations';
import { users } from './users';

export const assets = pgTable(
  'assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id),
    kind: text('kind').notNull(),
    url: text('url').notNull(),
    altText: text('alt_text'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('assets_organization_id_idx').on(table.organizationId),
    kindIdx: index('assets_kind_idx').on(table.kind),
  })
);

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
