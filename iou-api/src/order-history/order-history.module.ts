import { Module } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { OrderHistoryController } from './order-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderHistoryEntity } from './order-history.entity/order-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderHistoryEntity])],
  providers: [OrderHistoryService],
  controllers: [OrderHistoryController]
})
export class OrderHistoryModule { }
