// @ts-nocheck
import {
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateStudentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @MinLength(8)
  @MaxLength(100)
  @IsString()
  password: string;

  @Min(1)
  @IsNumber()
  teacherId: number;
}
