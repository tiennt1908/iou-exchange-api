import { Body, Controller, Get, Post, ValidationPipe, UsePipes, Query } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ChainEntity } from './chain.entity/chain.entity';
import { CreateChainDTO } from './dto/create-chain.dto';
import { GetChainDTO } from './dto/get-chain.dto';
import { ReturnQueryType } from 'src/helpers/type';

@Controller('chain')
export class ChainController {
  constructor(private readonly chainService: ChainService) {

  }
  @Get("/list")
  @UsePipes(ValidationPipe)
  async getChains(@Query() params: GetChainDTO): Promise<ReturnQueryType> {
    return await this.chainService.getChains(params);
  }
}
