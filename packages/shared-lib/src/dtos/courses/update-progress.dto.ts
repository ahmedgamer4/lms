// @ts-nocheck
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class UpdateEnrollmentProgressDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  enrollmentId: number;
}
