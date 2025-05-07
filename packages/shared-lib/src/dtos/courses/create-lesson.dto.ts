// @ts-nocheck
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateLessonDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsNumber()
  @Min(0)
  orderIndex: number;
}
