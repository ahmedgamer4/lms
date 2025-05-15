ALTER TABLE "videos" RENAME COLUMN "s3_key" TO "manifest_key";--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "segments_key" varchar(255) NOT NULL;