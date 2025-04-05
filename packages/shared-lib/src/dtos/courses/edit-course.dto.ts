import {
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
  @Min(0)
  @IsOptional()
  price?: string;
}
