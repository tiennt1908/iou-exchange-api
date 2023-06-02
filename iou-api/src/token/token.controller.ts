import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenService } from './token.service';
// import { CreateTokenDTO } from './dto/token.dto';
import { ReturnQueryType } from 'src/helpers/type';
import { GetTokenBasicDTO } from './dto/get-token-basic.dto';
import { CreateTokenDTO } from './dto/create-token.dto';
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {
    //
  }

  @Post('/create')
  @UsePipes(ValidationPipe)
  async create(@Body() params: CreateTokenDTO): Promise<ReturnQueryType> {
    return await this.tokenService.create(params);
  }

  @Get('/list/basic')
  @UsePipes(ValidationPipe)
  async getTokenBasicInfo(@Query() params: GetTokenBasicDTO): Promise<ReturnQueryType> {
    return await this.tokenService.getTokenBasicInfo(params);
  }
}
