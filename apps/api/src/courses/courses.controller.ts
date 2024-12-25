import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from '@lms-saas/shared-lib';
import { Roles } from '@/auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles('teacher')
  @Post()
  create(@Req() req, @Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto, req.user.id);
  }

  @Get('/by-teacher-id')
  getByTeacherId(
    @Req() req,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('with-teacher', ParseBoolPipe) withTeacher: boolean,
    @Query('published', ParseBoolPipe) published: boolean,
  ) {
    const offset = (page - 1) * limit;
    return this.coursesService.getByTeacherId(
      req.user.id,
      offset,
      limit,
      withTeacher,
      published,
    );
  }

  getOne() {}

  update() {}

  delete() {}

  publish() {}

  unPublish() {}
}
