CREATE TABLE "teachers" (
	"teacher_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"subdomain" text NOT NULL,
	"hashed_refresh_token" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "teachers_email_unique" UNIQUE("email"),
	CONSTRAINT "teachers_subdomain_unique" UNIQUE("subdomain")
);
