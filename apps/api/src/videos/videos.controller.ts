import { Roles } from '@/auth/decorators/roles.decorator';
import { S3Service } from '@/s3/s3.service';
import { User } from '@/users/decorators/user.decorator';
import { UploadVideoDto } from '@lms-saas/shared-lib';
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VideosService } from './videos.service';

@ApiBearerAuth()
@Controller('courses/:courseId/sections/:sectionId/videos')
export class VideosController {
  constructor(
    private s3Service: S3Service,
    private videosService: VideosService,
  ) {}

  @Post('upload')
  @Roles('teacher')
  async uploadVideo(
    @User() teacher: any,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() dto: UploadVideoDto,
  ) {
    const key = `videos/${teacher.id}/${sectionId}/${Date.now()}-${dto.title}.mp4`;
    const url = await this.s3Service.uploadVideo(key, 'video/mp4');

    await this.videosService.create(sectionId, key, dto);
    return { ...url };
  }
}
