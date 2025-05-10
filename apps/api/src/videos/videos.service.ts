import { db, UploadVideoDto, videos } from '@lms-saas/shared-lib';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class VideosService {
  async create(lessonId: number, s3Key: string, dto: UploadVideoDto) {
    try {
      return db
        .insert(videos)
        .values({ ...dto, lessonId, s3Key })
        .returning({
          id: videos.id,
          title: videos.title,
          s3Key: videos.s3Key,
        });
    } catch (error) {
      throw new InternalServerErrorException(`Cannot create video. ${error}`);
    }
  }

  async delete(id: string) {
    try {
      await db.delete(videos).where(eq(videos.s3Key, id));
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
