import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity/token.entity';
import { TokenInfoEntity } from 'src/token-info/token-info.entity/token-info.entity';
import { DappContractEntity } from 'src/dapp-contract/dapp-contract.entity/dapp-contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity, TokenInfoEntity, DappContractEntity])],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {
  //add token table
  //add token info
  //update chain event
}
