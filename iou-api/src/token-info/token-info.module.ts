import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TokenInfoService } from './token-info.service';
import { TokenInfoController } from './token-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenInfoEntity } from './token-info.entity/token-info.entity';
import { SignatureVerificationMiddleware } from 'src/middleware/signatureVerification.middleware';
import { ValidatorService } from 'src/validator/validator.service';
import { ValidatorEntity } from 'src/validator/validator.entity/validator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenInfoEntity]), TypeOrmModule.forFeature([ValidatorEntity])],
  providers: [TokenInfoService, ValidatorService],
  controllers: [TokenInfoController],
})
export class TokenInfoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignatureVerificationMiddleware)
      .forRoutes({ path: '/token-info/create', method: RequestMethod.POST });
  }
}
