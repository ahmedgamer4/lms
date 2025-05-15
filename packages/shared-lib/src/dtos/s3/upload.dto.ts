// @ts-nocheck
import { IsMimeType, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UploadDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsMimeType()
  @IsNotEmpty()
  contentType: string;

  @IsNumber()
  @IsNotEmpty()
  expiresIn: number;
}
