// @ts-nocheck
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateQuizAnswerDto {
  @IsString()
  @MinLength(1)
  answerText: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuizQuestionDto {
  @IsString()
  @MinLength(1)
  questionText: string;

  @IsNumber()
  @Min(0)
  orderIndex: number;

  @IsArray()
  @ValidateNested({ each: true })
  answers: CreateQuizAnswerDto[];
}
