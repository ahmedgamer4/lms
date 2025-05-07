import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsArray,
  ValidateNested,
} from "class-validator";
import { UpdateVideoDto } from "../videos/update-video.dto";

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  orderIndex?: number;

  @IsArray()
  @ValidateNested({ each: true })
  // @Type(() => UpdateVideoDto)
  @IsOptional()
  videos?: UpdateVideoDto[];
}
