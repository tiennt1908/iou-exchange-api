import { Type } from "class-transformer";
import { IsInt, IsOptional, Matches } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetTokenBasicDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Token ID invalid." })
  id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @IsOptional()
  @Matches(pattern.address, { message: "Contract Address invalid." })
  contract: string;
}