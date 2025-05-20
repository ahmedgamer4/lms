import { BACKEND_URL } from "./constants";
import { authFetch } from "./auth-fetch";
import {
  CreateQuizAnswerDto,
  CreateQuizDto,
  CreateQuizQuestionDto,
  UpdateQuizAnswerDto,
  UpdateQuizDto,
  UpdateQuizQuestionDto,
} from "@lms-saas/shared-lib/dtos";
import { z } from "zod";

const baseUrl = `${BACKEND_URL}/lessons`;

export interface Quiz {
  id: string;
  title: string;
  duration: number;
  questions: Array<any>;
  orderIndex: number;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  questionText: string;
  orderIndex: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  questionId: number;
  answerText: string;
  isCorrect: boolean;
}

export const createQuizSchema = z.object({
  title: z.string().min(3).max(255),
  duration: z.coerce.number().min(1),
});

export const createQuiz = (lessonId: number, input: CreateQuizDto) => {
  return authFetch<Quiz>(`${baseUrl}/${lessonId}/quizzes`, {
    method: "POST",
    data: input,
  });
};

export const updateQuiz = (
  lessonId: number,
  quizId: string,
  input: UpdateQuizDto,
) => {
  return authFetch<Quiz>(`${baseUrl}/${lessonId}/quizzes/${quizId}`, {
    method: "PUT",
    data: input,
  });
};

export const deleteQuiz = (lessonId: number, quizId: string) => {
  return authFetch<{ id: number }>(`${baseUrl}/${lessonId}/quizzes/${quizId}`, {
    method: "DELETE",
  });
};

export const getQuizQuestions = (quizId: string) => {
  return authFetch<QuizQuestion[]>(`${baseUrl}/1/quizzes/${quizId}/questions`, {
    method: "GET",
  });
};

export const createQuestion = async (
  quizId: string,
  data: CreateQuizQuestionDto,
) => {
  return authFetch<QuizQuestion>(`${baseUrl}/1/quizzes/${quizId}/questions`, {
    method: "POST",
    data,
  });
};

export const updateQuestion = async (
  questionId: number,
  data: UpdateQuizQuestionDto,
) => {
  return authFetch<QuizQuestion>(
    `${baseUrl}/1/quizzes/${crypto.randomUUID()}/questions/${questionId}`,
    {
      method: "PUT",
      data,
    },
  );
};

export const deleteQuestion = async (questionId: number) => {
  return authFetch(
    `${baseUrl}/1/quizzes/${crypto.randomUUID()}/questions/${questionId}`,
    {
      method: "DELETE",
    },
  );
};

export const addAnswer = async (
  questionId: number,
  data: CreateQuizAnswerDto,
) => {
  return authFetch<QuizAnswer>(
    `${baseUrl}/1/quizzes/${crypto.randomUUID()}/questions/${questionId}/answers`,
    {
      method: "POST",
      data,
    },
  );
};

export const updateAnswer = async (
  answerId: number,
  data: UpdateQuizAnswerDto,
) => {
  return authFetch<{ id: number }>(
    `${baseUrl}/1/quizzes/${crypto.randomUUID()}/questions/1/answers/${answerId}`,
    {
      method: "PUT",
      data,
    },
  );
};

export const deleteAnswer = async (answerId: number) => {
  return authFetch<{ id: number }>(
    `${baseUrl}/1/quizzes/${crypto.randomUUID()}/questions/1/answers/${answerId}`,
    {
      method: "DELETE",
    },
  );
};
