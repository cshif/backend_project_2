DO $$ BEGIN
 CREATE TYPE "public"."Role" AS ENUM('CUSTOMER', 'ADMIN', 'CUSTOMER_SERVICE', 'SALES');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Review" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"productId" bigserial NOT NULL,
	"userId" bigserial NOT NULL,
	"rating" integer DEFAULT 0,
	"title" varchar(255),
	"descriptions" varchar(255),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" varchar,
	"passwordChangedAt" timestamp (6) with time zone,
	"passwordResetToken" varchar(255),
	"passwordResetTokenExpiresIn" timestamp (6) with time zone,
	"lang" varchar(255),
	"role" "Role",
	"avatarURL" varchar(255),
	"active" boolean,
	"currentDeviceId" bigserial NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_currentDeviceId_unique" UNIQUE("currentDeviceId")
);
