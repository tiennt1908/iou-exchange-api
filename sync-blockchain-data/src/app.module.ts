import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateIOUContract } from './services/contracts/create-iou-contract';
import { DappContracts } from './services/dapp';
import { OrderBookService } from './services/orderbook';
import { TokenAPI } from './services/token';
import { TokenIouAPI } from './services/token-iou';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    CreateIOUContract,
    DappContracts,
    TokenAPI,
    TokenIouAPI,
    OrderBookService,
  ],
})
export class AppModule {
  //
}
