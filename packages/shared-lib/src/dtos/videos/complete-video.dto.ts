// @ts-nocheck
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CompleteVideoDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  enrollmentId: number;
}
