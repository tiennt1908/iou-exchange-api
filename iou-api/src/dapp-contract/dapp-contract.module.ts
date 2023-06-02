import { Module } from '@nestjs/common';
import { DappContractService } from './dapp-contract.service';
import { DappContractController } from './dapp-contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DappContractEntity } from './dapp-contract.entity/dapp-contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DappContractEntity])],
  providers: [DappContractService],
  controllers: [DappContractController]
})
export class DappContractModule { }
