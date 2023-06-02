import { Controller, Get, Query, UsePipes, ValidationPipe, Post, Body, Put } from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { OrderBookDTO } from './dto/order-book.dto';
import { ReturnQueryType } from 'src/helpers/type';
import { CreateOrderBookDTO } from './dto/create-order-book.dto';
import { UpdateOrderBookDTO } from './dto/update-order-book.dto';
import { OrderBookExchangeDTO } from './dto/order-book-exchange.dto';
import { GetMatchOrderDTO } from './dto/get-match-order';
import { GetMinPriceDTO } from './dto/get-min-price.dto';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';

@Controller('order-book')
export class OrderBookController {
  constructor(private readonly orderBookService: OrderBookService) {
    //
  }
  @Post('/create')
  @UsePipes(ValidationPipe)
  async createOrderBook(@Body() params: CreateOrderBookDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.createOrderBook(params);
  }
  @Put('/update')
  @UsePipes(ValidationPipe)
  async updateOrderBook(@Body() params: UpdateOrderBookDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.updateActionTrade(params);
  }
  @Put('/update/status')
  @UsePipes(ValidationPipe)
  async updateOrderStatus(@Body() params: UpdateOrderStatusDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.updateOrderStatus(params);
  }
  @Get('/list/on-chain')
  @UsePipes(ValidationPipe)
  async getOrderBook(@Query() params: OrderBookDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.getOrderBook(params);
  }
  @Get('/list')
  @UsePipes(ValidationPipe)
  async getOrderBookExchange(@Query() params: OrderBookExchangeDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.getOrderBookExchange(params);
  }
  @Get('/order-match')
  @UsePipes(ValidationPipe)
  async getMatchOrderSell(@Query() params: GetMatchOrderDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.getMatchOrders(params);
  }
  @Get('/min-price')
  @UsePipes(ValidationPipe)
  async getMinPrice(@Query() params: GetMinPriceDTO): Promise<ReturnQueryType> {
    return await this.orderBookService.getMinPrice(params);
  }
}
