import { db, UploadVideoDto, videos } from '@lms-saas/shared-lib';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class VideosService {
  async create(sectionId: number, s3Key: string, dto: UploadVideoDto) {
    try {
      await db.insert(videos).values({ ...dto, sectionId, s3Key });
    } catch (error) {
      throw new InternalServerErrorException(`Cannot create video. ${error}`);
    }
  }
}
