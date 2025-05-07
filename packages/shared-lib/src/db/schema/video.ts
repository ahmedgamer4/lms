import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { lessons } from "./course";
import { relations } from "drizzle-orm";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  s3Key: varchar("s3_key", { length: 255 }).notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const videosRelations = relations(videos, ({ one }) => ({
  lesson: one(lessons, {
    fields: [videos.lessonId],
    references: [lessons.id],
  }),
}));
