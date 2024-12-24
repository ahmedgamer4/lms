import { courses, CreateCourseDto, db } from '@lms-saas/shared-lib';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class CoursesService {
  async create(dto: CreateCourseDto, teacherId: number) {
    await db.insert(courses).values({ price: '0.00', ...dto, teacherId });
  }

  // TODO: Return number of students
  async getByTeacherId(
    teacherId: number,
    offset: number = NaN,
    limit: number = NaN,
    withTeacher: boolean = false,
  ) {
    if (!offset && !limit)
      return await db.query.courses.findMany({
        where: eq(courses.teacherId, teacherId),
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
      return await db.query.courses.findMany({
        where: eq(courses.teacherId, teacherId),
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
  }
}
