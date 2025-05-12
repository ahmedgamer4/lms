import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateQuizAnswerDto,
  CreateQuizDto,
  CreateQuizQuestionDto,
  db,
  quizAnswers,
  quizQuestions,
  quizzes,
  SelectQuizAnswer,
  UpdateQuizAnswerDto,
  UpdateQuizDto,
  UpdateQuizQuestionDto,
} from '@lms-saas/shared-lib';
import { eq } from 'drizzle-orm';

@Injectable()
export class QuizzesService {
  async create(lessonId: number, dto: CreateQuizDto) {
    const [quiz] = await db
      .insert(quizzes)
      .values({
        ...dto,
        lessonId,
      })
      .returning();

    return quiz;
  }

  async findOne(id: string) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));

    return quiz;
  }

  async update(id: string, dto: UpdateQuizDto) {
    await db.transaction(async (tx) => {
      const [quiz] = await db
        .update(quizzes)
        .set(dto)
        .where(eq(quizzes.id, id))
        .returning();

      if (dto.questions) {
        await tx.delete(quizQuestions).where(eq(quizQuestions.quizId, id));

        await tx.insert(quizQuestions).values(
          dto.questions.map((question) => ({
            quizId: id,
            questionText: question.questionText!,
            orderIndex: question.orderIndex!,
          })),
        );
      }
    });

    return this.findOne(id);
  }

  async delete(id: string) {
    const [quiz] = await db
      .delete(quizzes)
      .where(eq(quizzes.id, id))
      .returning();

    return quiz;
  }

  // Question operations
  async createQuestion(quizId: string, dto: CreateQuizQuestionDto) {
    const [question] = await db.transaction(async (tx) => {
      // Create question
      const [newQuestion] = await tx
        .insert(quizQuestions)
        .values({
          quizId,
          questionText: dto.questionText,
          orderIndex: dto.orderIndex,
        })
        .returning();

      // Create answers
      let answers;
      if (dto.answers && dto.answers.length > 0) {
        answers = await tx
          .insert(quizAnswers)
          .values(
            dto.answers.map((answer) => ({
              questionId: newQuestion.id,
              answerText: answer.answerText,
              isCorrect: answer.isCorrect,
            })),
          )
          .returning({
            id: quizAnswers.id,
            answerText: quizAnswers.answerText,
            isCorrect: quizAnswers.isCorrect,
          });
      }
      newQuestion['answers'] = answers;

      return [newQuestion];
    });

    return question;
  }

  async findQuestion(id: number) {
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, id));

    if (question) {
      const answers = await db
        .select()
        .from(quizAnswers)
        .where(eq(quizAnswers.questionId, id));

      return { ...question, answers };
    }

    return question;
  }

  async updateQuestion(id: number, dto: UpdateQuizQuestionDto) {
    const [question] = await db.transaction(async (tx) => {
      const [updatedQuestion] = await tx
        .update(quizQuestions)
        .set({
          questionText: dto.questionText,
          orderIndex: dto.orderIndex,
        })
        .where(eq(quizQuestions.id, id))
        .returning();

      if (dto.answers) {
        await tx.delete(quizAnswers).where(eq(quizAnswers.questionId, id));

        // Insert new answers
        if (dto.answers.length > 0) {
          await tx.insert(quizAnswers).values(
            dto.answers.map((answer) => ({
              questionId: id,
              answerText: answer.answerText!,
              isCorrect: answer.isCorrect,
            })),
          );
        }
      }

      return [updatedQuestion];
    });

    return question;
  }

  async deleteQuestion(id: number) {
    const [question] = await db
      .delete(quizQuestions)
      .where(eq(quizQuestions.id, id))
      .returning();

    return question;
  }

  async getQuizQuestions(quizId: string) {
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.orderIndex);

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await db
          .select({
            id: quizAnswers.id,
            answerText: quizAnswers.answerText,
            isCorrect: quizAnswers.isCorrect,
          })
          .from(quizAnswers)
          .where(eq(quizAnswers.questionId, question.id));
        return { ...question, answers };
      }),
    );

    return questionsWithAnswers;
  }

  async deleteAnswer(answerId: number) {
    try {
      await db
        .delete(quizAnswers)
        .where(eq(quizAnswers.id, answerId))
        .returning({
          id: quizAnswers.id,
        });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete answer. ${error}`,
      );
    }
  }
  async updateAnswer(answerId: number, dto: UpdateQuizAnswerDto) {
    try {
      const [answer] = await db
        .update(quizAnswers)
        .set(dto)
        .where(eq(quizAnswers.id, answerId))
        .returning({
          id: quizAnswers.id,
        });

      return answer;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update answer. ${error}`,
      );
    }
  }

  async createAnswer(questionId: number, dto: CreateQuizAnswerDto) {
    try {
      const [answer] = await db
        .insert(quizAnswers)
        .values({
          questionId,
          answerText: dto.answerText,
          isCorrect: dto.isCorrect,
        })
        .returning();

      return answer;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create answer. ${error}`,
      );
    }
  }
}
