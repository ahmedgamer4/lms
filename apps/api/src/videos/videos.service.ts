import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db, videos } from '@lms-saas/shared-lib';

@Injectable()
export class VideosService {
  async create(
    lessonId: number,
    data: {
      manifestKey: string;
      segmentsKey: string;
      title: string;
    },
  ) {
    try {
      const [video] = await db
        .insert(videos)
        .values({
          lessonId,
          title: data.title,
          manifestKey: data.manifestKey,
          segmentsKey: data.segmentsKey,
        })
        .returning({
          title: videos.title,
          manifestKey: videos.manifestKey,
          segmentsKey: videos.segmentsKey,
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
