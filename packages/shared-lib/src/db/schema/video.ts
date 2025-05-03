import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { courseSections } from "./course";
import { relations } from "drizzle-orm";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id")
    .notNull()
    .references(() => courseSections.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  s3Key: varchar("s3_key", { length: 255 }).notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const videosRelations = relations(videos, ({ one }) => ({
  section: one(courseSections, {
    fields: [videos.sectionId],
    references: [courseSections.id],
  }),
}));
