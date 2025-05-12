import {
  CourseEditDto,
  courses,
  courseSections,
  CreateCourseDto,
  CreateCourseSectionDto,
  db,
  UpdateCourseSectionDto,
  lessons,
} from '@lms-saas/shared-lib';
import { Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';

@Injectable()
export class CoursesService {
  async create(dto: CreateCourseDto, teacherId: number) {
    await db.insert(courses).values({ price: '0.00', ...dto, teacherId });
  }

  async getByTeacherId(
    teacherId: number,
    offset: number = NaN,
    limit: number = NaN,
    withTeacher: boolean = false,
    published: boolean = false,
  ) {
    let res;
    if (!offset && !limit)
      res = await db.query.courses.findMany({
        where: and(
          eq(courses.teacherId, teacherId),
          eq(courses.published, published),
        ),
        orderBy: courses.createdAt,
        columns: {
          createdAt: false,
          updatedAt: false,
        },
        with: withTeacher
          ? {
              teacher: {
                columns: {
                  name: true,
                },
              },
            }
          : {},
      });
    else {
      res = await db.query.courses.findMany({
        where: and(
          eq(courses.teacherId, teacherId),
          eq(courses.published, published),
        ),
        orderBy: courses.createdAt,
        columns: {
          createdAt: false,
          updatedAt: false,
        },
        with: withTeacher
          ? {
              teacher: {
                columns: {
                  name: true,
                },
              },
            }
          : {},
        limit,
        offset,
      });
    }

    const coursesCount = (
      await db
        .select({ count: count() })
        .from(courses)
        .where(
          and(
            eq(courses.teacherId, teacherId),
            eq(courses.published, published),
          ),
        )
    )[0].count;

    return {
      courses: res,
      count: coursesCount,
    };
  }

  async update(courseId: number, input: CourseEditDto) {
    await db.update(courses).set(input).where(eq(courses.id, courseId));
  }

  async getOne(courseId: number) {
    return await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        courseSections: {
          columns: {
            id: true,
            title: true,
            orderIndex: true,
          },
        },
      },
    });
  }

  async delete(courseId: number) {
    await db.delete(courses).where(eq(courses.id, courseId));
  }

  async addSection(courseId: number, dto: CreateCourseSectionDto) {
    return await db
      .insert(courseSections)
      .values({ ...dto, courseId })
      .returning({
        id: courseSections.id,
        title: courseSections.title,
        orderIndex: courseSections.orderIndex,
      });
  }

  async getSections(courseId: number) {
    return await db.query.courseSections.findMany({
      where: eq(courseSections.courseId, courseId),
    });
  }

  async updateSection(sectionId: number, dto: UpdateCourseSectionDto) {
    await db.transaction(async (tx) => {
      // Update section
      await tx
        .update(courseSections)
        .set({
          title: dto.title,
          orderIndex: dto.orderIndex,
        })
        .where(eq(courseSections.id, sectionId));

      // Update lesson order if provided
      if (dto.lessons?.length) {
        for (const lesson of dto.lessons) {
          await tx
            .update(lessons)
            .set({
              title: lesson.title,
              orderIndex: lesson.orderIndex,
            })
            .where(eq(lessons.id, lesson.id!));
        }
      }
    });

    return await db.query.courseSections.findFirst({
      where: eq(courseSections.id, sectionId),
      with: {
        lessons: true,
      },
    });
  }

  async deleteSection(sectionId: number) {
    return await db
      .delete(courseSections)
      .where(eq(courseSections.id, sectionId));
  }

  async findSection(sectionId: number) {
    return await db.query.courseSections.findFirst({
      where: eq(courseSections.id, sectionId),
      with: {
        lessons: {
          columns: {
            id: true,
            title: true,
            orderIndex: true,
          },
          with: {
            videos: {
              columns: {
                lessonId: false,
                createdAt: false,
              },
            },
            quizzes: {
              columns: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: lessons.orderIndex,
        },
      },
    });
  }
}
