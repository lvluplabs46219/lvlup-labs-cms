import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from '-orm/pg-core';

import { organizations } from './organizations';
import { users } from './users';

export const alertStatusEnum = pgEnum('alert_status', ['unread', 'read', 'archived']);

export const alerts = pgTable(
  'alerts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    userId: uuid('user_id').references(() => users.id),
    type: text('type').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    status: alertStatusEnum('status').notNull().default('unread'),
    payload: jsonb('payload').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('alerts_organization_id_idx').on(table.organizationId),
    statusIdx: index('alerts_status_idx').on(table.status),
  })
);

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
