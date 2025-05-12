import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class UpdateQuizAnswerDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  answerText?: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}

export class UpdateQuizQuestionDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  questionText?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  orderIndex?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  answers?: UpdateQuizAnswerDto[];
}
