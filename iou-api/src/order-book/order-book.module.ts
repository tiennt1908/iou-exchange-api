import { Module } from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { OrderBookController } from './order-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderBookEntity } from './order-book.entity/order-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderBookEntity])],
  providers: [OrderBookService],
  controllers: [OrderBookController]
})
export class OrderBookModule { }
