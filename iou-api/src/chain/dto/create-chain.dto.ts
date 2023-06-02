import { Length, Matches } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class CreateChainDTO {
  @Matches(pattern.number, { message: "Chain ID invalid." })
  @Length(1, 255, { message: "Chain ID length from 1 -> 255 characters." })
  id: string;
  @Length(1, 255, { message: "Chain Name length from 1 -> 255 characters." })
  @Matches(pattern.name, { message: "Chain Name invalid." })
  chainName: string;
  @Matches(pattern.fullURL, { message: "RPC URL invalid." })
  rpcURL: string;
}