import { InferSelectModel, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const teachers = pgTable("teachers", {
  teacherId: serial("teacher_id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  profilePictureUrl: text("profile_picture_url"),
  hashedRefreshToken: text("hashed_refresh_token"),
  createdAt: timestamp("created_at", { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  contactInfo: text("contact_info"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
});

export type SelectTeacher = InferSelectModel<typeof teachers>;
