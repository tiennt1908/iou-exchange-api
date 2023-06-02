import { Module } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ValidatorController } from './validator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorEntity } from './validator.entity/validator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ValidatorEntity])],
  providers: [ValidatorService],
  controllers: [ValidatorController]
})
export class ValidatorModule { }
