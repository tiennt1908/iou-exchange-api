import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class OrderBookExchangeDTO {
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenIn: string;

  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOut: string;

  @Type(() => Number)
  @IsInt({ message: "Decimal invalid." })
  @Min(0, { message: "Decimal >= 0." })
  @Max(18, { message: "Decimal <= 18." })
  decimal: number;

  @IsString({ message: "Column invalid." })
  column: string;

  @Matches(pattern.sort, { message: "Sort invalid." })
  sort: string;

  @Matches(/^(buy|sell)$/, { message: "Sort invalid." })
  side: string;

}