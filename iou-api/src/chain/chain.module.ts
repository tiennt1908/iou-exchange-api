import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainController } from './chain.controller';
import { ChainEntity } from './chain.entity/chain.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChainEntity])],
  providers: [ChainService],
  controllers: [ChainController],
})
export class ChainModule {
  //
}
