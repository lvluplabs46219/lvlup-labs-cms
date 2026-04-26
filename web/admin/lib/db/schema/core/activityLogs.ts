import { index, jsonb, pgTable, text, timestamp, uuid } from '-orm/pg-core';

import { organizations } from './organizations';
import { users } from './users';

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    userId: uuid('user_id').references(() => users.id),
    entityType: text('entity_type').notNull(),
    entityId: text('entity_id').notNull(),
    action: text('action').notNull(),
    payload: jsonb('payload').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('activity_logs_organization_id_idx').on(table.organizationId),
    entityIdx: index('activity_logs_entity_idx').on(table.entityType, table.entityId),
  })
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
