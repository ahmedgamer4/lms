ALTER TABLE "submitted_question_answers" DROP CONSTRAINT "submitted_question_answers_correct_answer_id_quiz_answers_id_fk";
--> statement-breakpoint
ALTER TABLE "submitted_question_answers" DROP COLUMN "correct_answer_id";