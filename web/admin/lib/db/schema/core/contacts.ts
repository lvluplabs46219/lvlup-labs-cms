import { index, pgTable, text, timestamp, uuid } from '-orm/pg-core';

import { organizations } from './organizations';

export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    company: text('company'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('contacts_organization_id_idx').on(table.organizationId),
  })
);

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
