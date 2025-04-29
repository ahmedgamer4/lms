import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CoursesModule,
    YoutubeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
