// @ts-nocheck
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateCourseSectionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsNumber()
  @Min(0)
  orderIndex: number;
}
