import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { S3Module } from './s3/s3.module';
import { VideosModule } from './videos/videos.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CoursesModule,
    S3Module,
    VideosModule,
    LessonsModule,
    QuizzesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
