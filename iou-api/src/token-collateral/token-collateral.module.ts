import { Module } from '@nestjs/common';
import { TokenCollateralService } from './token-collateral.service';
import { TokenCollateralController } from './token-collateral.controller';

@Module({
  providers: [TokenCollateralService],
  controllers: [TokenCollateralController]
})
export class TokenCollateralModule {}
