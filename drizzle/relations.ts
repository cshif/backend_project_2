import { relations } from "drizzle-orm/relations";
import { plan, planToProduct, product, user, userPlan, review, device, order, receipt, userCoupon, coupon, referral } from "./schema";

export const planToProductRelations = relations(planToProduct, ({one}) => ({
	plan: one(plan, {
		fields: [planToProduct.a],
		references: [plan.id]
	}),
	product: one(product, {
		fields: [planToProduct.b],
		references: [product.id]
	}),
}));

export const planRelations = relations(plan, ({many}) => ({
	planToProducts: many(planToProduct),
	userPlans: many(userPlan),
}));

export const productRelations = relations(product, ({many}) => ({
	planToProducts: many(planToProduct),
	reviews: many(review),
}));

export const userPlanRelations = relations(userPlan, ({one, many}) => ({
	user: one(user, {
		fields: [userPlan.userId],
		references: [user.id]
	}),
	plan: one(plan, {
		fields: [userPlan.planId],
		references: [plan.id]
	}),
	orders: many(order),
}));

export const userRelations = relations(user, ({one, many}) => ({
	userPlans: many(userPlan),
	reviews: many(review),
	device: one(device, {
		fields: [user.currentDeviceId],
		references: [device.id]
	}),
	userCoupons: many(userCoupon),
	referrals_referrerId: many(referral, {
		relationName: "referral_referrerId_user_id"
	}),
	referrals_refereeId: many(referral, {
		relationName: "referral_refereeId_user_id"
	}),
}));

export const reviewRelations = relations(review, ({one}) => ({
	user: one(user, {
		fields: [review.userId],
		references: [user.id]
	}),
	product: one(product, {
		fields: [review.productId],
		references: [product.id]
	}),
}));

export const deviceRelations = relations(device, ({many}) => ({
	users: many(user),
}));

export const orderRelations = relations(order, ({one, many}) => ({
	userPlan: one(userPlan, {
		fields: [order.userPlanId],
		references: [userPlan.id]
	}),
	receipts: many(receipt),
}));

export const receiptRelations = relations(receipt, ({one}) => ({
	order: one(order, {
		fields: [receipt.orderId],
		references: [order.id]
	}),
}));

export const userCouponRelations = relations(userCoupon, ({one, many}) => ({
	user: one(user, {
		fields: [userCoupon.userId],
		references: [user.id]
	}),
	coupon: one(coupon, {
		fields: [userCoupon.couponId],
		references: [coupon.id]
	}),
	referrals: many(referral),
}));

export const couponRelations = relations(coupon, ({many}) => ({
	userCoupons: many(userCoupon),
}));

export const referralRelations = relations(referral, ({one}) => ({
	userCoupon: one(userCoupon, {
		fields: [referral.userCouponId],
		references: [userCoupon.id]
	}),
	user_referrerId: one(user, {
		fields: [referral.referrerId],
		references: [user.id],
		relationName: "referral_referrerId_user_id"
	}),
	user_refereeId: one(user, {
		fields: [referral.refereeId],
		references: [user.id],
		relationName: "referral_refereeId_user_id"
	}),
}));