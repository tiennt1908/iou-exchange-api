import { Type } from "class-transformer";
import { IsInt, Matches, Max, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetChartDTO {
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenIn: string;

  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOut: string;

  @Type(() => Number)
  @Min(60, { message: "Time Range > 60." })
  @Max(2592000, { message: "Time Range <= 2592000s" })
  timeRange: number;

  @Type(() => Number)
  @Min(1, { message: "Limit >= 1" })
  @Max(365, { message: "Limit <= 100" })
  limit: number
}