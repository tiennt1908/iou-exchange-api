import { Body, Controller, Get, Post, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { DappContractService } from './dapp-contract.service';
import { ReturnQueryType } from 'src/helpers/type';
import { DappConditionsDTO } from './dto/dapp-contract-conditions.dto';

@Controller('dapp-contract')
export class DappContractController {
  constructor(private readonly dappContractService: DappContractService) {
    //
  }
  @Get('/list')
  @UsePipes(ValidationPipe)
  async getDappContracts(@Query() input: DappConditionsDTO): Promise<ReturnQueryType> {
    return await this.dappContractService.getDappContracts(input);
  }
}
