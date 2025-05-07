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
import { videos } from "./video";

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

export const courseSections = pgTable("course_sections", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),
  title: varchar("title", { length: 255 }).notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  orderIndex: integer("order_index").notNull(),
  sectionId: integer("section_id")
    .references(() => courseSections.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.teacherId],
  }),
  courseSections: many(courseSections),
}));

export const courseSectionsRelations = relations(
  courseSections,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseSections.courseId],
      references: [courses.id],
    }),
    lessons: many(lessons),
  }),
);

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  courseSection: one(courseSections, {
    fields: [lessons.sectionId],
    references: [courseSections.id],
  }),

  videos: many(videos),
}));

export type SelectCourse = InferSelectModel<typeof courses>;
export type SelectCourseSection = InferSelectModel<typeof courseSections>;
export type SelectLesson = InferSelectModel<typeof lessons>;
