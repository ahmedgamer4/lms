//@ts-nocheck
import { IsNumber, IsPositive } from "class-validator";

export class GenerateCodesDto {
  @IsNumber()
  @IsPositive()
  quantity: number;
}
