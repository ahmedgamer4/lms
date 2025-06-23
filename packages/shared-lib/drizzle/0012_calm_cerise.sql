CREATE TABLE "student_video_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"enrollment_id" integer NOT NULL,
	"video_id" uuid NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submitted_question_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"answer_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "student_video_completions" ADD CONSTRAINT "student_video_completions_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "student_video_completions" ADD CONSTRAINT "student_video_completions_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submitted_question_answers" ADD CONSTRAINT "submitted_question_answers_question_id_quiz_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "submitted_question_answers" ADD CONSTRAINT "submitted_question_answers_answer_id_quiz_answers_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."quiz_answers"("id") ON DELETE cascade ON UPDATE cascade;