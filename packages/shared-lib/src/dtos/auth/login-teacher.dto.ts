// @ts-nocheck
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginTeacherDto {
  @IsEmail()
  @IsString()
  email: string;

  @MinLength(8)
  @MaxLength(100)
  @IsString()
  password: string;
}
