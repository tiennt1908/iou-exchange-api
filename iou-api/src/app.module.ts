import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChainModule } from './chain/chain.module';
import { DappContractTypeModule } from './dapp-contract-type/dapp-contract-type.module';
import { DappContractModule } from './dapp-contract/dapp-contract.module';
import { SignatureVerificationMiddleware } from './middleware/signatureVerification.middleware';
import { OrderBookModule } from './order-book/order-book.module';
import { OrderHistoryModule } from './order-history/order-history.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { TokenInfoModule } from './token-info/token-info.module';
import { TokenModule } from './token/token.module';
import { ValidatorEntity } from './validator/validator.entity/validator.entity';
import { ValidatorModule } from './validator/validator.module';
import { ValidatorService } from './validator/validator.service';
import { TokenIouModule } from './token-iou/token-iou.module';
import { TokenCollateralModule } from './token-collateral/token-collateral.module';
import { TokenOfficialModule } from './token-official/token-official.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'iou_trade',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ValidatorEntity]),
    ChainModule,
    TokenModule,
    TokenInfoModule,
    OrderStatusModule,
    OrderBookModule,
    OrderHistoryModule,
    ValidatorModule,
    DappContractTypeModule,
    DappContractModule,
    TokenIouModule,
    TokenCollateralModule,
    TokenOfficialModule,
  ],
  controllers: [AppController],
  providers: [AppService, ValidatorService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignatureVerificationMiddleware)
      .forRoutes(
        { path: '/token-info/create', method: RequestMethod.POST },
        { path: '/token/create', method: RequestMethod.POST },
        { path: '/token-iou/update', method: RequestMethod.PUT },
        { path: '/token-iou/create', method: RequestMethod.POST },

        { path: '/order-book/create', method: RequestMethod.POST },
        { path: '/order-book/update', method: RequestMethod.PUT },
        { path: '/order-book/update/status', method: RequestMethod.PUT }
      );
  }
}
