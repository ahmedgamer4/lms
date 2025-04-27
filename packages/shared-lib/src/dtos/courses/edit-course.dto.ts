import {
  IsBoolean,
  IsDecimal,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from "class-validator";

export class CourseEditDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsDecimal()
  @IsOptional()
  price?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
