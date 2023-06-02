import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Matches, Max, Min, max } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetTokenIouDTO {

  @Type(() => Number)
  @IsInt({ message: "Index invalid." })
  index: number;

  @Type(() => Number)
  @Min(1, { message: "Limit > 1" })
  @Max(20, { message: "Limit <= 20" })
  limit: number;

  @IsString({ message: "Column invalid." })
  column: string;

  @Matches(pattern.sort, { message: "Sort invalid." })
  sort: string;

  @Matches(pattern.address, { message: "Token Official invalid." })
  tokenOfficial: string;

  @Type(() => Number)
  @IsInt({ message: "Chain ID invalid." })
  chainId: number;
}