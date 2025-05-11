import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UploadVideoDto } from '@lms-saas/shared-lib';
import { db, videos } from '@lms-saas/shared-lib';

@Injectable()
export class VideosService {
  async create(lessonId: number, s3Key: string, dto: UploadVideoDto) {
    try {
      const [video] = await db
        .insert(videos)
        .values({
          lessonId,
          title: dto.title,
          s3Key,
        })
        .returning({
          title: videos.title,
          s3Key: videos.s3Key,
          id: videos.id,
        });

      return video;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create video');
    }
  }

  async delete(id: string) {
    try {
      await db.delete(videos).where(eq(videos.id, id));
    } catch (error) {
      throw new InternalServerErrorException(`Cannot remove video. ${error}`);
    }
  }

  async getVideo(id: string) {
    try {
      return db.select().from(videos).where(eq(videos.id, id));
    } catch (error) {
      throw new InternalServerErrorException(`Cannot get video. ${error}`);
    }
  }
}
