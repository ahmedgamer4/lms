// @ts-nocheck
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from "class-validator";

export class SubmittedAnswer {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  questionId: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  answerId: number;
}

export class CompleteQuizDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  enrollmentId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmittedAnswer)
  answers: SubmittedAnswer[];
}
