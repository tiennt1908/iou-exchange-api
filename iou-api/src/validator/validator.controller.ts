import { Controller, Get } from '@nestjs/common';
import { ValidatorService } from './validator.service';
import { ValidatorEntity } from './validator.entity/validator.entity';

@Controller('validator')
export class ValidatorController {
  constructor(private readonly ValidatorService: ValidatorService) {
    //
  }

}
