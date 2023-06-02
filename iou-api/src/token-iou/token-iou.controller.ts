import { Body, Controller, Get, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenIouService } from './token-iou.service';
import { UpdateTokenIouDTO } from './dto/update-token-iou';
import { ReturnQueryType } from 'src/helpers/type';
import { GetTokenIouBasicDTO } from './dto/get-token-iou-basic';
import { CreateTokenIouDTO } from './dto/create-token-iou.dto';
import { GetTokenIouDTO } from './dto/get-token-iou';

@Controller('token-iou')
export class TokenIouController {
  constructor(private tokenIouService: TokenIouService) {

  }

  @Put("/update")
  @UsePipes(ValidationPipe)
  async update(@Body() params: UpdateTokenIouDTO) {
    return await this.tokenIouService.update(params);
  }

  @Get('/list/basic')
  @UsePipes(ValidationPipe)
  async getTokenIouBasicInfo(@Query() params: GetTokenIouBasicDTO): Promise<ReturnQueryType> {
    return await this.tokenIouService.getTokenIouBasicInfo(params);
  }

  @Get('/list')
  @UsePipes(ValidationPipe)
  async getTokenIou(@Query() params: GetTokenIouDTO): Promise<ReturnQueryType> {
    return await this.tokenIouService.getTokenIou(params);
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  createFull(@Body() params: CreateTokenIouDTO): Promise<ReturnQueryType> {
    return this.tokenIouService.create(params);
  }
}
