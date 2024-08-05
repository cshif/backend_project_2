import { pgTable, uniqueIndex, index, foreignKey, pgEnum, integer, bigint, serial, timestamp, bigserial, varchar, text, numeric, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const deviceType = pgEnum("DeviceType", ['IOS', 'ANDROID', 'MAC', 'WINDOWS', 'LINUX'])
export const role = pgEnum("Role", ['CUSTOMER', 'ADMIN', 'CUSTOMER_SERVICE', 'SALES'])


export const planToProduct = pgTable("_PlanToProduct", {
	a: integer("A").notNull().references(() => plan.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	b: bigint("B", { mode: "number" }).notNull().references(() => product.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		abUnique: uniqueIndex("_PlanToProduct_AB_unique").using("btree", table.a, table.b),
		bIdx: index().using("btree", table.b),
	}
});

export const userPlan = pgTable("UserPlan", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("userId", { mode: "number" }).notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	planId: integer("planId").notNull().references(() => plan.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		planIdKey: uniqueIndex("UserPlan_planId_key").using("btree", table.planId),
	}
});

export const review = pgTable("Review", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("productId", { mode: "number" }).notNull().references(() => product.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	rating: integer("rating").default(0).notNull(),
	title: varchar("title", { length: 255 }),
	descriptions: varchar("descriptions", { length: 255 }),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("userId", { mode: "number" }).notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
});

export const plan = pgTable("Plan", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const product = pgTable("Product", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	price: numeric("price"),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const user = pgTable("User", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }),
	passwordChangedAt: timestamp("passwordChangedAt", { precision: 6, withTimezone: true, mode: 'string' }),
	passwordResetToken: varchar("passwordResetToken", { length: 255 }),
	passwordResetTokenExpiresIn: timestamp("passwordResetTokenExpiresIn", { precision: 6, withTimezone: true, mode: 'string' }),
	lang: varchar("lang", { length: 255 }),
	avatarUrl: varchar("avatarURL", { length: 255 }),
	active: boolean("active"),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	role: role("role"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	currentDeviceId: bigint("currentDeviceId", { mode: "number" }).references(() => device.id, { onDelete: "set null", onUpdate: "cascade" } ),
},
(table) => {
	return {
		currentDeviceIdKey: uniqueIndex("User_currentDeviceId_key").using("btree", table.currentDeviceId),
		emailKey: uniqueIndex("User_email_key").using("btree", table.email),
	}
});

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).primaryKey().notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const device = pgTable("Device", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	type: deviceType("type"),
	uid: text("UID").notNull(),
	lastUsedAt: timestamp("lastUsedAt", { precision: 3, mode: 'string' }).notNull(),
	isConnected: boolean("isConnected"),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const order = pgTable("Order", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	userPlanId: integer("userPlanId").notNull().references(() => userPlan.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userPlanIdKey: uniqueIndex("Order_userPlanId_key").using("btree", table.userPlanId),
	}
});

export const receipt = pgTable("Receipt", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	orderId: bigint("orderId", { mode: "number" }).notNull().references(() => order.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		orderIdKey: uniqueIndex("Receipt_orderId_key").using("btree", table.orderId),
	}
});

export const userCoupon = pgTable("UserCoupon", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("userId", { mode: "number" }).notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	couponId: bigint("couponId", { mode: "number" }).notNull().references(() => coupon.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	redeemed: boolean("redeemed"),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		couponIdKey: uniqueIndex("UserCoupon_couponId_key").using("btree", table.couponId),
		userIdKey: uniqueIndex("UserCoupon_userId_key").using("btree", table.userId),
	}
});

export const coupon = pgTable("Coupon", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	couponCode: text("couponCode").notNull(),
	issuedLimit: integer("issuedLimit").notNull(),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const referral = pgTable("Referral", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	referrerId: bigint("referrerId", { mode: "number" }).notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	refereeId: bigint("refereeId", { mode: "number" }).notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userCouponId: bigint("userCouponId", { mode: "number" }).notNull().references(() => userCoupon.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	createdAt: timestamp("createdAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		refereeIdKey: uniqueIndex("Referral_refereeId_key").using("btree", table.refereeId),
		referrerIdKey: uniqueIndex("Referral_referrerId_key").using("btree", table.referrerId),
		referrerIdRefereeIdKey: uniqueIndex("Referral_referrerId_refereeId_key").using("btree", table.referrerId, table.refereeId),
		userCouponIdKey: uniqueIndex("Referral_userCouponId_key").using("btree", table.userCouponId),
	}
});