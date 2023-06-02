import { Module } from '@nestjs/common';
import { TokenIouService } from './token-iou.service';
import { TokenIouController } from './token-iou.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenIouEntity } from './token-iou.entity/token-iou.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenIouEntity])],
  providers: [TokenIouService],
  controllers: [TokenIouController]
})
export class TokenIouModule { }
