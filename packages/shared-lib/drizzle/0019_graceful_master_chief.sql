ALTER TABLE "submitted_question_answers" RENAME COLUMN "correct_answer" TO "correct_answer_id";--> statement-breakpoint
ALTER TABLE "submitted_question_answers" DROP CONSTRAINT "submitted_question_answers_correct_answer_quiz_answers_id_fk";
--> statement-breakpoint
ALTER TABLE "submitted_question_answers" ADD CONSTRAINT "submitted_question_answers_correct_answer_id_quiz_answers_id_fk" FOREIGN KEY ("correct_answer_id") REFERENCES "public"."quiz_answers"("id") ON DELETE cascade ON UPDATE cascade;