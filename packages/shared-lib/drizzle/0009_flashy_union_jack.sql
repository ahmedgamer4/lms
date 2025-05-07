CREATE TABLE "lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"order_index" integer NOT NULL,
	"section_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" RENAME COLUMN "section_id" TO "lesson_id";--> statement-breakpoint
ALTER TABLE "videos" DROP CONSTRAINT "videos_section_id_course_sections_id_fk";
--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_section_id_course_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."course_sections"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_lesson_id_course_sections_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."course_sections"("id") ON DELETE cascade ON UPDATE no action;