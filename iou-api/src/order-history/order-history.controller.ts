import { Controller, Get, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { OrderHistoryService } from './order-history.service';
import { ReturnQueryType } from 'src/helpers/type';
import { GetChartDTO } from './dto/get-chart.dto';
import { GetPriceInfoDTO } from './dto/get-price-info.dto';

@Controller('order-history')
export class OrderHistoryController {
  constructor(private readonly orderHistoryService: OrderHistoryService) {
    //
  }
  @Get('/chart')
  @UsePipes(ValidationPipe)
  async getChartData(@Query() params: GetChartDTO): Promise<ReturnQueryType> {
    return await this.orderHistoryService.getChartData(params);
  }
  @Get('/price-info')
  @UsePipes(ValidationPipe)
  async getPriceInfo(@Query() params: GetPriceInfoDTO): Promise<ReturnQueryType> {
    return await this.orderHistoryService.getPriceInfo(params);
  }
}
