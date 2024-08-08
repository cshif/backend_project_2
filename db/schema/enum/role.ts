import { pgEnum } from 'drizzle-orm/pg-core';

export const role = pgEnum('Role', [
  'CUSTOMER',
  'ADMIN',
  'CUSTOMER_SERVICE',
  'SALES',
]);
