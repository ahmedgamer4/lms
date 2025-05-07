import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateLessonDto,
  db,
  lessons,
  UpdateLessonDto,
  videos,
} from '@lms-saas/shared-lib';
import { eq } from 'drizzle-orm';

@Injectable()
export class LessonsService {
  async findOne(lessonId: number) {
    try {
      const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
          videos: {
            columns: {
              lessonId: false,
            },
          },
        },
      });

      return lesson;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find lesson. ${error}`);
    }
  }

  async create(sectionId: number, dto: CreateLessonDto) {
    try {
      return await db
        .insert(lessons)
        .values({ ...dto, sectionId })
        .returning({ id: lessons.id });
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find lesson. ${error}`);
    }
  }

  async update(lessonId: number, dto: UpdateLessonDto) {
    try {
      await db.transaction(async (tx) => {
        // Update lesson
        await tx
          .update(lessons)
          .set({
            title: dto.title,
            orderIndex: dto.orderIndex,
          })
          .where(eq(lessons.id, lessonId));

        // Update videos
        await tx.delete(videos).where(eq(videos.lessonId, lessonId));
        if (dto.videos && dto.videos.length > 0) {
          await tx.insert(videos).values(
            dto.videos.map((video) => ({
              lessonId,
              title: video.title!,
              s3Key: video.s3Key!,
              orderIndex: video.orderIndex!,
            })),
          );
        }

        // // Update quizzes
        // await tx.delete(quizzes).where(eq(quizzes.lessonId, lessonId));
        // if (dto.quizzes.length > 0) {
        //   await tx.insert(quizzes).values(
        //     dto.quizzes.map((quiz) => ({
        //       lessonId,
        //       title: quiz.title,
        //       duration: quiz.duration,
        //       questions: quiz.questions,
        //       orderIndex: quiz.orderIndex,
        //     })),
        //   );
        // }
      });

      return await this.findOne(lessonId);
    } catch (error) {
      throw new InternalServerErrorException(`Cannot update lesson. ${error}`);
    }
  }

  async delete(lessonId: number) {
    try {
      return db
        .delete(lessons)
        .where(eq(lessons.id, lessonId))
        .returning({ id: lessons.id });
    } catch (error) {
      throw new InternalServerErrorException(`Cannot delete lesson. ${error}`);
    }
  }
}
