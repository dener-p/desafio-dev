import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  description: text('description').notNull(),
  amount: integer('amount').notNull(), // Store in cents
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  date: text('date').notNull(),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
});
