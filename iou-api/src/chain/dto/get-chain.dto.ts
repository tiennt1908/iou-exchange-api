import { Type } from "class-transformer";
import { Max, Min } from "class-validator";

export class GetChainDTO {
  @Type(() => Number)
  @Min(0, { message: "Limit >= 0" })
  index: number;

  @Type(() => Number)
  @Min(1, { message: "Limit >= 1" })
  @Max(20, { message: "Limit <= 20" })
  limit: number;
}