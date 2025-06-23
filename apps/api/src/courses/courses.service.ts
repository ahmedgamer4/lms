import {
  CourseEditDto,
  courses,
  courseSections,
  CreateCourseDto,
  CreateCourseSectionDto,
  db,
  UpdateCourseSectionDto,
  enrollments,
  lessons,
  studentLessonCompletions,
} from '@lms-saas/shared-lib';
import { Injectable, NotFoundException } from '@nestjs/common';
import { and, count, desc, eq } from 'drizzle-orm';

type WithClause = {
  courseSections?: {
    orderBy?: any;
    columns: { id: true; title: true; orderIndex: true };
    with: {
      lessons: {
        orderBy?: any;
        columns: { sectionId: false };
        with: {
          videos: { columns: { id: true } };
          quizzes: { columns: { id: true } };
        };
      };
    };
  };
  courseCodes?: {
    columns: any;
  };
  enrollments?: {
    columns: { id: true; progress: true; enrolledAt: true };
    where: any;
  };
  teacher?: {
    columns: { name: true };
  };
};

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
    withEnrollments?: boolean,
    studentId?: number,
  ) {
    const withClause: WithClause = {};

    if (withTeacher) {
      withClause.teacher = {
        columns: { name: true },
      };
    }
    if (withEnrollments && studentId) {
      withClause.enrollments = {
        columns: { id: true, progress: true, enrolledAt: true },
        where: eq(enrollments.studentId, studentId),
      };
    }

    let res;
    if (!offset && !limit)
      res = await db.query.courses.findMany({
        where: and(
          eq(courses.teacherId, teacherId),
          eq(courses.published, published),
        ),
        orderBy: [desc(courses.createdAt)],
        columns: {
          createdAt: false,
          updatedAt: false,
        },
        with: withClause,
      });
    else {
      res = await db.query.courses.findMany({
        where: and(
          eq(courses.teacherId, teacherId),
          eq(courses.published, published),
        ),
        orderBy: [desc(courses.createdAt)],
        columns: {
          createdAt: false,
          updatedAt: false,
        },
        with: withClause,
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

  async getOne(
    courseId: number,
    studentId?: number,
    withSections = false,
    withEnrollments = false,
    withCourseCodes = false,
  ) {
    const withClause: WithClause = {};

    if (withSections) {
      withClause.courseSections = {
        orderBy: [courseSections.orderIndex],
        columns: {
          id: true,
          title: true,
          orderIndex: true,
        },
        with: {
          lessons: {
            orderBy: [lessons.orderIndex],
            columns: {
              sectionId: false,
            },
            with: {
              videos: {
                columns: {
                  id: true,
                },
              },
              quizzes: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      };
    }

    if (withEnrollments && studentId) {
      withClause.enrollments = {
        columns: {
          id: true,
          progress: true,
          enrolledAt: true,
        },
        where: eq(enrollments.studentId, studentId),
      };
    }

    if (withCourseCodes) {
      withClause.courseCodes = {
        columns: { id: true },
      };
    }

    const data = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        ...withClause,
      },
    });

    return data;
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

  async getEnrolledCourses(studentId: number) {
    const res = await db.query.enrollments.findMany({
      where: and(
        eq(enrollments.studentId, studentId),
        eq(enrollments.status, 'active'),
      ),
      with: {
        course: {
          columns: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            price: true,
            published: true,
            teacherId: true,
          },
        },
      },
      columns: {
        id: true,
        progress: true,
        enrolledAt: true,
      },
    });

    const courses = res.map((en) => {
      return {
        ...en.course,
        enrollments: [
          {
            id: en.id,
            progress: en.progress,
            enrolledAt: en.enrolledAt,
          },
        ],
      };
    });
    return courses;
  }

  async updateEnrollmentProgress(enrollmentId: number) {
    const enrollment = await db.query.enrollments.findFirst({
      where: eq(enrollments.id, enrollmentId),
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const courseId = enrollment.courseId;

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lessonsResult = await db
      .select({ value: count(lessons.id) })
      .from(lessons)
      .innerJoin(courseSections, eq(lessons.sectionId, courseSections.id))
      .where(eq(courses.id, courseSections.courseId));

    const totalLessons = lessonsResult[0].value;

    if (totalLessons === 0) {
      await db
        .update(enrollments)
        .set({ progress: 0 })
        .where(eq(enrollments.id, enrollmentId));
    }

    const completedLessons = await db
      .select({ value: count(studentLessonCompletions.id) })
      .from(studentLessonCompletions)
      .where(eq(studentLessonCompletions.enrollmentId, enrollmentId));

    const completedLessonsCount = completedLessons[0].value;

    const progress = Math.round((completedLessonsCount / totalLessons) * 100);

    await db
      .update(enrollments)
      .set({ progress })
      .where(eq(enrollments.id, enrollmentId));

    return { progress };
  }
}
