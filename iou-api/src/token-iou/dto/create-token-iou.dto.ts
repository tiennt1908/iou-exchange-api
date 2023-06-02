import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class CreateTokenIouDTO {

  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @Min(1, { message: "Event Number >= 1." })
  eventNumber: number;

  @Matches(pattern.address, { message: "Token Address invalid." })
  tokenAddress: string;

  @IsString({ message: "Token Name invalid." })
  tokenName: string;

  @IsString({ message: "Token Symbol invalid." })
  tokenSymbol: string;

  @IsInt({ message: "Token Decimal invalid." })
  tokenDecimal: number;

  @Matches(pattern.address, { message: "Creator Address invalid." })
  creatorAddress: string;

  @Min(0, { message: "Circulating Supply >= 0." })
  circulatingSupply: number;

  @Min(0, { message: "Collateral Amount >= 0." })
  collateralAmount: number;

  @IsInt({ message: "Deadline invalid." })
  deadline: number;

  @IsInt({ message: "Token Collateral ID invalid." })
  tokenCollateralId: number;

  @IsInt({ message: "Token Official ID invalid." })
  tokenOfficialId: number;

  @IsBoolean({ message: "Is Public Pool invalid." })
  isPublicPool: boolean;
}