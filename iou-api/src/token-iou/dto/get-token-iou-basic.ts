import { Type } from "class-transformer";
import { IsInt, IsOptional, Matches } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetTokenIouBasicDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @IsOptional()
  @Matches(pattern.address, { message: "Contract Address invalid." })
  contract: string;
}