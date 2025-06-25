ALTER TABLE "quiz_submissions" ADD COLUMN "student_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD COLUMN "score" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;