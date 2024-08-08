import { relations } from 'drizzle-orm';
import {
  pgTable,
  bigserial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { role } from './enum/role';
import { review } from './review';

export const user = pgTable('User', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password'),
  passwordChangedAt: timestamp('passwordChangedAt', {
    precision: 6,
    withTimezone: true,
  }),
  passwordResetToken: varchar('passwordResetToken', { length: 255 }),
  passwordResetTokenExpiresIn: timestamp('passwordResetTokenExpiresIn', {
    precision: 6,
    withTimezone: true,
  }),
  lang: varchar('lang', { length: 255 }),
  role: role('role'),
  avatarURL: varchar('avatarURL', { length: 255 }),
  active: boolean('active'),
  currentDeviceId: bigserial('currentDeviceId', { mode: 'number' }).unique(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  reviews: many(review),
}));
