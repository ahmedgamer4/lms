import {
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from "class-validator";

export class UpdateVideoDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  title?: string;
}
