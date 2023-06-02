import { IsNotEmpty, Matches, IsOptional, Length, MaxLength } from "class-validator";
import { pattern } from "src/helpers/pattern";

export class CreateTokenInfoDTO {
  @Matches(pattern.name, { message: "Token Name invalid." })
  tokenName: string;
  @Matches(pattern.symbol, { message: "Token Symbol invalid." })
  tokenSymbol: string;
  @IsOptional()
  @Matches(pattern.imgURL, { message: "Logo URL invalid." })
  @MaxLength(255, { message: "The maximum length of a Logo URL is 255 characters." })
  logoURL: string;
  @IsOptional()
  @Matches(pattern.domain, { message: "Website URL invalid." })
  @MaxLength(64, { message: "The maximum length of a Website URL is 64 characters." })
  websiteURL: string;
}