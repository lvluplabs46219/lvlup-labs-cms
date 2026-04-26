import { index, pgEnum, pgTable, text, timestamp, uuid } from '-orm/pg-core';

export const organizationStatusEnum = pgEnum('organization_status', ['active', 'inactive', 'archived']);

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    status: organizationStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index('organizations_slug_idx').on(table.slug),
  })
);

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
