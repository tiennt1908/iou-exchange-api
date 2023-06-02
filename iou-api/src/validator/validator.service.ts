import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidatorEntity } from './validator.entity/validator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValidatorService {
  constructor(
    @InjectRepository(ValidatorEntity)
    private readonly ValidatorClass: Repository<ValidatorEntity>,
  ) {
    //
  }
  async isValidator(address: string): Promise<boolean> {
    const validator = await this.ValidatorClass.query(`SELECT address FROM validator_table WHERE address="${address.toLowerCase()}" AND isActive=true`);
    return validator?.length === 1;
  }
}
