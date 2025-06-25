ALTER TABLE "student_quiz_completions" RENAME TO "quiz_submissions";--> statement-breakpoint
ALTER TABLE "quiz_submissions" DROP CONSTRAINT "student_quiz_completion_unique";--> statement-breakpoint
ALTER TABLE "quiz_submissions" DROP CONSTRAINT "student_quiz_completions_enrollment_id_enrollments_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_submissions" DROP CONSTRAINT "student_quiz_completions_quiz_id_quizzes_id_fk";
--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submission_unique" UNIQUE NULLS NOT DISTINCT("enrollment_id","quiz_id");