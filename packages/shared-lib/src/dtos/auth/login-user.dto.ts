// @ts-nocheck
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsString()
  email: string;

  @MinLength(8)
  @MaxLength(100)
  @IsString()
  password: string;

  @MinLength(3)
  @MaxLength(100)
  @IsString()
  role: string;
}
