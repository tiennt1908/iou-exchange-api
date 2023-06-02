import { Type } from "class-transformer";
import { IsInt, Matches } from "class-validator";

export class UpdateOrderStatusDTO {
  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @IsInt({ message: "Event Number invalid." })
  eventNumber: number;

  @IsInt({ message: "Order Book Id invalid." })
  orderBookId: number;

  @Matches(/^[3]$/, { message: "Order Status invalid." })
  orderStatus: string;
}