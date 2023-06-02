import { Type } from "class-transformer";
import { IsInt, Matches, Min } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class CreateOrderBookDTO {

  @Type(() => Number)
  @IsInt({ message: "Dapp Contract ID invalid." })
  dappId: number;

  @IsInt({ message: "Event Number invalid." })
  eventNumber: number;

  @IsInt({ message: "Order ID invalid." })
  orderIdOnChain: number;

  @Matches(pattern.address, { message: "Maker Address invalid." })
  makerAddress: string;

  @Min(0, { message: "Token In Amount invalid." })
  tokenInAmount: number;

  @Min(0, { message: "Token Out Amount invalid." })
  tokenOutAmount: number;

  @IsInt({ message: "Create At invalid." })
  createAt: number;

  @Matches(pattern.address, { message: "Token In Address invalid." })
  tokenInAddress: string;

  @Matches(pattern.address, { message: "Token Out Address invalid." })
  tokenOutAddress: string;

  @IsInt({ message: "Order Status ID invalid." })
  orderStatusId: number;

}