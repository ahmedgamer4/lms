// @ts-nocheck
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateStudentDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @MinLength(8)
  @MaxLength(256)
  @IsString()
  password: string;

  @MinLength(3)
  @MaxLength(200)
  @IsString()
  teacherSubdomain: string;
}
