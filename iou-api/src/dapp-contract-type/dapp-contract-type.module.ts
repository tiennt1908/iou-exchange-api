import { Module } from '@nestjs/common';
import { DappContractTypeService } from './dapp-contract-type.service';
import { DappContractTypeController } from './dapp-contract-type.controller';

@Module({
  providers: [DappContractTypeService],
  controllers: [DappContractTypeController]
})
export class DappContractTypeModule {}
