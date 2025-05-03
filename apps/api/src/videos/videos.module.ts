import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { S3Service } from '@/s3/s3.service';
import { ConfigModule } from '@nestjs/config';
import { VideosService } from './videos.service';
import s3Config from '@/s3/config/s3.config';

@Module({
  imports: [ConfigModule.forFeature(s3Config)],
  controllers: [VideosController],
  providers: [S3Service, VideosService],
})
export class VideosModule {}
