import { index, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';

export const userRoleEnum = pgEnum('user_role', ['admin', 'sales', 'ops']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    email: text('email').notNull(),
    name: text('name'),
    role: userRoleEnum('role').notNull().default('admin'),
    avatarUrl: text('avatar_url'),
    walletAddress: text('wallet_address'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('users_organization_id_idx').on(table.organizationId),
    orgEmailIdx: index('users_org_email_idx').on(table.organizationId, table.email),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
