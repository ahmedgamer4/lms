import {
  CourseEditDto,
  courses,
  CreateCourseDto,
  db,
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
    });
  }

  async delete(courseId: number) {
    await db.delete(courses).where(eq(courses.id, courseId));
  }
}
