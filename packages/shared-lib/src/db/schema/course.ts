import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { teachers } from "./user";
import { InferSelectModel, relations, sql } from "drizzle-orm";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id")
    .notNull()
    .references(() => teachers.teacherId, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export const coursesRelations = relations(courses, ({ one }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.teacherId],
  }),
}));

export type SelectCourse = InferSelectModel<typeof courses>;
