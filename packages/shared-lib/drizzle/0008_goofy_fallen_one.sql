CREATE TABLE "course_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"code" varchar(16) NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"assigned_to" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"used_at" timestamp with time zone,
	CONSTRAINT "course_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "course_codes" ADD CONSTRAINT "course_codes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_codes" ADD CONSTRAINT "course_codes_assigned_to_students_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;