// @ts-nocheck
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
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
}
