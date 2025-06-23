import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { enrollments, lessons } from "./course";
import { InferSelectModel, relations, sql } from "drizzle-orm";

export const quizzes = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: uuid("quiz_id")
    .references(() => quizzes.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  questionText: text("question_text").notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => quizQuestions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  answerText: text("answer_text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
});

export const submittedQuestionAnswers = pgTable("submitted_question_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .references(() => quizQuestions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  answerId: integer("answer_id")
    .references(() => quizAnswers.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const studentQuizCompletions = pgTable("student_quiz_completions", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .references(() => enrollments.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),

  quizId: uuid("quiz_id")
    .references(() => quizzes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow(),
});

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  questions: many(quizQuestions),
  studentQuizCompletions: many(studentQuizCompletions),
}));

export const quizQuestionsRelations = relations(
  quizQuestions,
  ({ one, many }) => ({
    quiz: one(quizzes, {
      fields: [quizQuestions.quizId],
      references: [quizzes.id],
    }),
    answers: many(quizAnswers),
  }),
);

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizAnswers.questionId],
    references: [quizQuestions.id],
  }),
}));

export const studentQuizCompletionsRelations = relations(
  studentQuizCompletions,
  ({ one }) => ({
    quiz: one(quizzes, {
      fields: [studentQuizCompletions.quizId],
      references: [quizzes.id],
    }),
    enrollment: one(enrollments, {
      fields: [studentQuizCompletions.enrollmentId],
      references: [enrollments.id],
    }),
  }),
);

export type SelectQuiz = InferSelectModel<typeof quizzes>;
export type SelectQuizQuestion = InferSelectModel<typeof quizQuestions>;
export type SelectQuizAnswer = InferSelectModel<typeof quizAnswers>;
