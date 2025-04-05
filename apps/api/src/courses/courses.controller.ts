import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseEditDto, CreateCourseDto } from '@lms-saas/shared-lib';
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

  @Get('/:courseId')
  getOne(@Param('courseId', ParseIntPipe) courseId: number) {
    try {
      return this.coursesService.getOne(courseId);
    } catch (error) {
      throw new InternalServerErrorException('Cannot update course');
    }
  }

  @Put('/:courseId')
  update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() input: CourseEditDto,
  ) {
    try {
      this.coursesService.update(courseId, input);
    } catch (error) {
      throw new InternalServerErrorException('Cannot update course');
    }
  }

  @Delete('/:courseId')
  @Roles('teacher')
  delete(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.delete(courseId);
  }

  @Put('/:courseId/publish')
  @Roles('teacher')
  publish(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.update(courseId, {
      published: true,
    });
  }

  @Delete('/:courseId/unpublish')
  @Roles('teacher')
  unPublish(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.coursesService.update(courseId, {
      published: false,
    });
  }
}
