// @ts-nocheck
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CompleteQuizDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  enrollmentId: number;
}
