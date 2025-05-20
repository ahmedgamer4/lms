import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  courses,
  CreateLessonDto,
  db,
  enrollments,
  lessons,
  studentLessonCompletions,
  UpdateLessonDto,
  videos,
} from '@lms-saas/shared-lib';
import { count, eq, sql } from 'drizzle-orm';

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
              createdAt: false,
            },
          },
          quizzes: {
            columns: {
              lessonId: false,
              createdAt: false,
              updatedAt: false,
            },
          },
        },
      });

      return lesson;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find lesson. ${error}`);
    }
  }

  async create(courseId: number, sectionId: number, dto: CreateLessonDto) {
    try {
      const [lesson] = await db
        .insert(lessons)
        .values({ ...dto, sectionId })
        .returning({ id: lessons.id });

      await db
        .update(courses)
        .set({
          lessonsCount: sql`lessons_count + 1`,
        })
        .where(eq(courses.id, courseId));

      return lesson;
    } catch (error) {
      throw new InternalServerErrorException(`Cannot find lesson. ${error}`);
    }
  }

  async update(lessonId: number, dto: UpdateLessonDto) {
    try {
      await db.transaction(async (tx) => {
        await tx.update(lessons).set(dto).where(eq(lessons.id, lessonId));

        // Update videos
        if (dto.videos && dto.videos.length > 0) {
          await tx
            .update(videos)
            .set({
              title: dto.videos[0].title,
            })
            .where(eq(videos.lessonId, lessonId));
        }
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

  async complete(courseId: number, lessonId: number, enrollmentId: number) {
    try {
      const lesson = await this.findOne(lessonId);

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }

      const enrollment = await db.query.enrollments.findFirst({
        where: eq(enrollments.id, enrollmentId),
      });

      if (!enrollment) {
        throw new NotFoundException('Enrollment not found');
      }

      const studentLessonCompletion =
        await db.query.studentLessonCompletions.findFirst({
          where: eq(studentLessonCompletions.lessonId, lessonId),
        });

      if (studentLessonCompletion) {
        throw new ConflictException('Lesson already completed');
      }

      await db.insert(studentLessonCompletions).values({
        lessonId,
        enrollmentId,
      });

      const totalLessons = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        columns: {
          lessonsCount: true,
        },
      });

      if (!totalLessons) {
        throw new NotFoundException('Course not found');
      }

      const completedLessons = await db
        .select({
          count: count(studentLessonCompletions.lessonId),
        })
        .from(studentLessonCompletions)
        .where(eq(studentLessonCompletions.enrollmentId, enrollmentId));

      const progress = Math.round(
        (completedLessons[0].count || 0 / totalLessons.lessonsCount || 1) * 100,
      );

      await db
        .update(enrollments)
        .set({ progress })
        .where(eq(enrollments.id, enrollmentId));

      return { message: 'Lesson completed' };
    } catch (error) {
      throw new InternalServerErrorException(
        `Cannot complete lesson. ${error}`,
      );
    }
  }
}
