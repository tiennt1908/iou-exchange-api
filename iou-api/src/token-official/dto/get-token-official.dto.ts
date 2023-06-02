import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Matches, Max, Min, max } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class GetTokenOfficialDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Chain ID invalid." })
  chainId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Index invalid." })
  index: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: "Limit > 1" })
  @Max(20, { message: "Limit <= 20" })
  limit: number;

  @IsOptional()
  @IsString({ message: "Column invalid." })
  column: string;

  @IsOptional()
  @Matches(pattern.sort, { message: "Sort invalid." })
  sort: string;

}