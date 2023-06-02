import { Type } from "class-transformer";
import { IsInt, Matches, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class UpdateOrderBookDTO {

  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @IsInt({ message: "Event Number invalid." })
  eventNumber: number;

  @Matches(pattern.address, { message: "Taker Address invalid." })
  takerAddress: string;

  @Min(0, { message: "Amount invalid." })
  amount: number;

  @Min(0, { message: "Estimate value invalid." })
  estimateValue: number;

  @IsInt({ message: "Order At invalid." })
  orderAt: number;

  @IsInt({ message: "Order Book Id invalid." })
  orderBookId: number;

  @Matches(/^[1-3]$/, { message: "Order Status invalid." })
  orderStatus: string;
}