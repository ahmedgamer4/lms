// @ts-nocheck
import {
  IsMimeType,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class InitiateVideoUploadDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  description?: string;

  @IsNumber()
  @Min(1)
  fileSize: number;

  @IsMimeType()
  mimeType: string;
}
