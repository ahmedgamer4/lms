import {
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { lessons } from "./course";
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

export const videosRelations = relations(videos, ({ one }) => ({
  lesson: one(lessons, {
    fields: [videos.lessonId],
    references: [lessons.id],
  }),
}));
