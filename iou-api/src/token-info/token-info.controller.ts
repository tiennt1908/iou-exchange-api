import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTokenInfoDTO } from './dto/create-token-info.dto';
import { TokenInfoEntity } from './token-info.entity/token-info.entity';
import { TokenInfoService } from './token-info.service';

@Controller('token-info')
export class TokenInfoController {
  constructor(private readonly tokenInfoService: TokenInfoService) {
    //
  }
  @Post('/create')
  @UsePipes(ValidationPipe)
  create(@Body() createTokenInfoDTO: CreateTokenInfoDTO) {
    return this.tokenInfoService.create(createTokenInfoDTO);
  }
}

//web3.eth.accounts.recover(unix time, '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c');
//xac minh chu ky user post