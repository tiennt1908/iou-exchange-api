import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ValidatorService } from 'src/validator/validator.service';
import Web3 from 'web3';

@Injectable()
export class SignatureVerificationMiddleware implements NestMiddleware {
  constructor(private readonly ValidatorService: ValidatorService) {
    //
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const signature = req.headers['signature'] as string;
    const message = req.headers['message'] as string;
    const web3 = new Web3();
    let address: string;
    try {
      address = web3.eth.accounts.recover(message, signature)
    }
    catch (err) {
      throw new HttpException("Signature invalid.", HttpStatus.FORBIDDEN);
    }
    const isValidator = await this.ValidatorService.isValidator(address);
    if (!isValidator) {
      throw new HttpException("Validator invalid.", HttpStatus.FORBIDDEN);
    }
    next();
  }
}
