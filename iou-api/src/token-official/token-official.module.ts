import { Module } from '@nestjs/common';
import { TokenOfficialService } from './token-official.service';
import { TokenOfficialController } from './token-official.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenOfficialEntity } from './token-official.entity/token-official.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenOfficialEntity])],
  providers: [TokenOfficialService],
  controllers: [TokenOfficialController]
})
export class TokenOfficialModule { }
