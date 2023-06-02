import { Type } from "class-transformer";
import { IsInt, IsOptional, Matches, MaxLength, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class CreateTokenDTO {

  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Matches(pattern.address, { message: "Token Address invalid." })
  tokenAddress: string;

  @Matches(pattern.name, { message: "Token Name invalid." })
  tokenName: string;

  @Matches(pattern.symbol, { message: "Token Symbol invalid." })
  tokenSymbol: string;

  @IsInt({ message: "Token Decimal invalid." })
  tokenDecimal: number;

}