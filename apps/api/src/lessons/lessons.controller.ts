import { Roles } from '@/auth/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from '@lms-saas/shared-lib';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('courses/:courseId/sections/:sectionId/lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  @Roles('teacher')
  async create(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.create(sectionId, dto);
  }

  @Get('/:lessonId')
  @Roles('teacher', 'student')
  async findOne(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return await this.lessonsService.findOne(lessonId);
  }

  @Put('/:lessonId')
  @Roles('teacher')
  async update(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() dto: UpdateLessonDto,
  ) {
    return await this.lessonsService.update(lessonId, dto);
  }

  @Delete('/:lessonId')
  @Roles('teacher')
  async delete(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return await this.lessonsService.delete(lessonId);
  }
}
