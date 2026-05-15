import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});
export const sessions = sqliteTable('sessions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().references(() => users.id),
    token: text('token').notNull(),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
    expiresAt: text('expires_at').notNull(),
}, (table) => ({
    tokenIndex: index('token_idx').on(table.token),
}));