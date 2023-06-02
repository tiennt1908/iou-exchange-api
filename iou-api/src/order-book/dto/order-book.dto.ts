import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, Length, Matches, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class OrderBookDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Order ID invalid." })
  id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Order ID Onchain invalid." })
  orderIdOnchain: number;

  @IsOptional()
  @Matches(pattern.address, { message: "Maker Address invalid." })
  maker: string;

  @IsOptional()
  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenIn: string;

  @IsOptional()
  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOut: string;

  @IsOptional()
  @Matches(pattern.address, { message: "Token Out Address invalid." })
  orderStatusId: string;

}