import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
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
import {
  CourseEditDto,
  CreateCourseDto,
  CreateCourseSectionDto,
  UpdateCourseSectionDto,
} from '@lms-saas/shared-lib';
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

  @Post('/:courseId/sections')
  @Roles('teacher')
  addSection(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() dto: CreateCourseSectionDto,
  ) {
    try {
      return this.coursesService.addSection(courseId, dto);
    } catch (error) {
      throw new InternalServerErrorException('Cannot add course section');
    }
  }

  @Get('/:courseId/sections')
  @Roles('teacher')
  getSections(@Param('courseId', ParseIntPipe) courseId: number) {
    try {
      return this.coursesService.getSections(courseId);
    } catch (error) {
      throw new InternalServerErrorException('Cannot find course sections');
    }
  }

  @Put('/:courseId/sections/:sectionId')
  @Roles('teacher')
  updateSection(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() dto: UpdateCourseSectionDto,
  ) {
    try {
      return this.coursesService.updateSection(sectionId, dto);
    } catch (error) {
      throw new InternalServerErrorException('Cannot update course section');
    }
  }

  @Delete('/:courseId/sections/:sectionId')
  @Roles('teacher')
  async deleteSection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    const section = await this.coursesService.findSection(sectionId);
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    try {
      return this.coursesService.deleteSection(sectionId);
    } catch (error) {
      throw new InternalServerErrorException('Cannot delete course section');
    }
  }
}
