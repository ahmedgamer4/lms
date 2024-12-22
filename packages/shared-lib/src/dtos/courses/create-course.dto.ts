// @ts-nocheck
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;
}
