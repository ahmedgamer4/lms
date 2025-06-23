import {
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { enrollments, lessons } from "./course";
import { relations } from "drizzle-orm";

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  manifestKey: varchar("manifest_key", { length: 255 }).notNull(),
  segmentsKey: varchar("segments_key", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const studentVideoCompletions = pgTable("student_video_completions", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .references(() => enrollments.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),

  videoId: uuid("video_id")
    .references(() => videos.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow(),
});

export const videosRelations = relations(videos, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [videos.lessonId],
    references: [lessons.id],
  }),
  studentVideoCompletions: many(studentVideoCompletions),
}));

export const studentVideoCompletionsRelations = relations(
  studentVideoCompletions,
  ({ one }) => ({
    video: one(videos, {
      fields: [studentVideoCompletions.videoId],
      references: [videos.id],
    }),
    enrollment: one(enrollments, {
      fields: [studentVideoCompletions.enrollmentId],
      references: [enrollments.id],
    }),
  }),
);
