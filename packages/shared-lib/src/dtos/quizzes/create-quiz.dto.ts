// @ts-nocheck
import { IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateQuizDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsNumber()
  @Min(1)
  duration: number;
}
