import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, Length, Matches, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class DappConditionsDTO {

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  id: number;

  @IsOptional()
  @Matches(pattern.address, { message: "Contract Address invalid." })
  contract: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Chain ID invalid." })
  chainId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Type ID invalid." })
  typeId: number;

  @IsOptional()
  @Type(() => Number)
  @Min(0, { message: "Index invalid." })
  index: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: "Limit invalid." })
  limit: number;

}