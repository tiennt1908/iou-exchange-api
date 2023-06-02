import { Type } from "class-transformer";
import { IsInt, Matches, Max, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetPriceInfoDTO {
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenIn: string;

  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOut: string;

  @Type(() => Number)
  @Min(60, { message: "Time range >= 60." })
  @Max(2592000, { message: "Time range <= 2592000s" })
  timeRange: number;
}