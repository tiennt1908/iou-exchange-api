import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenOfficialService } from './token-official.service';
import { GetTokenOfficialDTO } from './dto/get-token-official.dto';
import { ReturnQueryType } from 'src/helpers/type';

@Controller('token-official')
export class TokenOfficialController {
  constructor(private tokenOfficialService: TokenOfficialService) { }
  @Get('/list')
  @UsePipes(ValidationPipe)
  async getTokenOfficial(@Query() params: GetTokenOfficialDTO): Promise<ReturnQueryType> {
    return await this.tokenOfficialService.getTokenOfficial(params);
  }
}
