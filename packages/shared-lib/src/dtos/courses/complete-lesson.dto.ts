// @ts-nocheck
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CompleteLessonDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  enrollmentId: number;
}
