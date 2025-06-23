import { Roles } from '@/auth/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import {
  CompleteQuizDto,
  CreateQuizAnswerDto,
  CreateQuizDto,
  CreateQuizQuestionDto,
  UpdateQuizAnswerDto,
  UpdateQuizDto,
  UpdateQuizQuestionDto,
} from '@lms-saas/shared-lib';
import { RolesGuard } from '@/auth/guards/roles/roles.guard';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('lessons/:lessonId/quizzes')
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  @Post()
  @Roles('teacher')
  async create(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() dto: CreateQuizDto,
  ) {
    return this.quizzesService.create(lessonId, dto);
  }

  @Get('/:quizId')
  @Roles('teacher', 'student')
  async findOne(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzesService.findOne(quizId);
  }

  @Put('/:quizId')
  @Roles('teacher')
  async update(
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() dto: UpdateQuizDto,
  ) {
    return this.quizzesService.update(quizId, dto);
  }

  @Delete('/:quizId')
  @Roles('teacher')
  async delete(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzesService.delete(quizId);
  }

  @Post('/:quizId/complete')
  @Roles('student')
  async completeQuiz(
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() dto: CompleteQuizDto,
  ) {
    return this.quizzesService.completeQuiz(quizId, dto.enrollmentId);
  }

  @Get('/:quizId/completed')
  @Roles('student')
  async checkIfCompleted(
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Query('enrollmentId', ParseIntPipe) enrollmentId: number,
  ) {
    return this.quizzesService.checkIfCompleted(quizId, enrollmentId);
  }

  @Get('/:quizId/questions')
  @Roles('teacher', 'student')
  async getQuizQuestions(@Param('quizId', ParseUUIDPipe) quizId: string) {
    return this.quizzesService.getQuizQuestions(quizId);
  }

  @Post('/:quizId/questions')
  @Roles('teacher')
  async createQuestion(
    @Param('quizId', ParseUUIDPipe) quizId: string,
    @Body() dto: CreateQuizQuestionDto,
  ) {
    return this.quizzesService.createQuestion(quizId, dto);
  }

  @Get('/:quizId/questions/:questionId')
  @Roles('teacher', 'student')
  async findQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.quizzesService.findQuestion(questionId);
  }

  @Put('/:quizId/questions/:questionId')
  @Roles('teacher')
  async updateQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: UpdateQuizQuestionDto,
  ) {
    return this.quizzesService.updateQuestion(questionId, dto);
  }

  @Delete('/:quizId/questions/:questionId')
  @Roles('teacher')
  async deleteQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.quizzesService.deleteQuestion(questionId);
  }

  @Post('/:quizId/questions/:questionId/answers')
  @Roles('teacher')
  async createAnswer(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Body() dto: CreateQuizAnswerDto,
  ) {
    return this.quizzesService.createAnswer(questionId, dto);
  }

  @Put('/:quizId/questions/:questionId/answers/:answerId')
  @Roles('teacher')
  async updateAnswer(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() dto: UpdateQuizAnswerDto,
  ) {
    return this.quizzesService.updateAnswer(answerId, dto);
  }

  @Delete('/:quizId/questions/:questionId/answers/:answerId')
  @Roles('teacher')
  async deleteAnswer(@Param('answerId', ParseIntPipe) answerId: number) {
    return this.quizzesService.deleteAnswer(answerId);
  }
}
