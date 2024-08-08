import { relations } from 'drizzle-orm';
import {
  pgTable,
  bigserial,
  integer,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user';

export const review = pgTable('Review', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  productId: bigserial('productId', { mode: 'number' }),
  userId: bigserial('userId', { mode: 'number' }),
  rating: integer('rating').default(0),
  title: varchar('title', { length: 255 }),
  descriptions: varchar('descriptions', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
}));
