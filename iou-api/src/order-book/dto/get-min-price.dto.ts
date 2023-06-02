import { Type } from "class-transformer";
import { IsInt, Matches } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetMinPriceDTO {
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenIn: string;

  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOut: string;
}