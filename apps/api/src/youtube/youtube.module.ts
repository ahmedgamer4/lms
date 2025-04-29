import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { ConfigModule } from '@nestjs/config';
import youtubeConfig from './config/youtube.config';

@Module({
  imports: [ConfigModule.forFeature(youtubeConfig)],
  providers: [YoutubeService],
})
export class YoutubeModule {}
