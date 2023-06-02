import { IsBoolean, IsInt, Min } from "class-validator";

export class UpdateTokenIouDTO {
  @IsInt({ message: "Dapp ID invalid." })
  dappId: number;
  @IsInt({ message: "Token IOU ID invalid." })
  id: number;
  @Min(0, { message: "Total Supply Official Token >= 0." })
  totalSupplyOfficialToken: number;
  @Min(0, { message: "Total Supply Promise Token >= 0." })
  totalSupplyPromiseToken: number;
  @Min(0, { message: "Total Supply Collateral Token >= 0." })
  totalSupplyCollateralToken: number;
  @IsInt({ message: "Event Number invalid." })
  eventNumber: number
}