import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { YoutubeService } from '@/youtube/youtube.service';
import { ConfigModule } from '@nestjs/config';
import youtubeConfig from '@/youtube/config/youtube.config';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule.forFeature(youtubeConfig), CloudinaryModule],
  controllers: [CoursesController],
  providers: [CoursesService, YoutubeService],
})
export class CoursesModule {}
