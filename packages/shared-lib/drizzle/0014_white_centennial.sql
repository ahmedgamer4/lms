ALTER TABLE "quizzes" ALTER COLUMN "lesson_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student_lesson_completions" ADD CONSTRAINT "student_lesson_completion_unique" UNIQUE NULLS NOT DISTINCT("enrollment_id","lesson_id");--> statement-breakpoint
ALTER TABLE "student_video_completions" ADD CONSTRAINT "student_video_completion_unique" UNIQUE NULLS NOT DISTINCT("enrollment_id","video_id");--> statement-breakpoint
ALTER TABLE "student_quiz_completions" ADD CONSTRAINT "student_quiz_completion_unique" UNIQUE NULLS NOT DISTINCT("enrollment_id","quiz_id");