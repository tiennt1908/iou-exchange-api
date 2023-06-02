import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsPositive, Matches, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetMatchOrderDTO {
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenIn: string;

  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOut: string;

  @Type(() => Number)
  @IsPositive({ message: "Price > 0." })
  price: number;

  @Type(() => Number)
  @IsPositive({ message: "Min payment amount > 0." })
  paymentAmount: number;
}