import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from '@lms-saas/shared-lib/dist/dtos';
import { hash } from 'argon2';
import { db, teachers } from '@lms-saas/shared-lib';
import { eq } from 'drizzle-orm';
import { Role } from '@/auth/types/roles';

@Injectable()
export class UsersService {
  async createTeacher(dto: CreateTeacherDto) {
    const { password, email, name, subdomain } = dto;

    const domainExists = await db.query.teachers.findFirst({
      where: eq(teachers.subdomain, subdomain),
    });
    if (domainExists)
      throw new BadRequestException('Subdomain already exists, change it');

    // Hash password
    const passwordHash = await hash(password);
    // Create user
    await db
      .insert(teachers)
      .values({
        email,
        passwordHash,
        subdomain,
        name,
      })
      .returning({ id: teachers.teacherId });
  }

  async findTeacherByEmail(email: string) {
    return await db.query.teachers.findFirst({
      where: eq(teachers.email, email),
    });
  }

  async findTeacher(id: number) {
    return await db.query.teachers.findFirst({
      where: eq(teachers.teacherId, id),
    });
  }

  async updateHashedRefreshToken(
    userId: number,
    role: Role,
    hashedRT: string | null,
  ) {
    if (role === 'teacher')
      await db
        .update(teachers)
        .set({ hashedRefreshToken: hashedRT })
        .where(eq(teachers.teacherId, userId));
  }
}
