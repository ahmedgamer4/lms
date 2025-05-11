import { Roles } from '@/auth/decorators/roles.decorator';
import { S3Service } from '@/s3/s3.service';
import { User } from '@/users/decorators/user.decorator';
import { UploadVideoDto } from '@lms-saas/shared-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VideosService } from './videos.service';

@ApiBearerAuth()
@ApiTags('videos')
@Controller('lessons/:lessonId/videos')
export class VideosController {
  constructor(
    private s3Service: S3Service,
    private videosService: VideosService,
  ) {}

  @Post('upload')
  @Roles('teacher')
  async uploadVideo(
    @User() teacher: any,
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() dto: UploadVideoDto,
  ) {
    const key = `videos/${teacher.id}/${lessonId}/${crypto.randomUUID()}-${dto.title}`;
    const s3Res = await this.s3Service.uploadVideo(key, 'video/mp4');

    const res = await this.videosService.create(lessonId, key, dto);
    return { ...s3Res, videoDetails: res };
  }

  @Delete('/:id')
  @Roles('teacher')
  delete(@Param('id') id: string) {
    return this.videosService.delete(id);
  }

  @Get('/:id')
  @Roles('teacher', 'student')
  async getVideoUrl(@Param('id') id: string) {
    const video = await this.videosService.getVideo(id);
    const url = await this.s3Service.getSignedUrl(video[0].s3Key);
    return { videoId: video[0].id, url };
  }
}
