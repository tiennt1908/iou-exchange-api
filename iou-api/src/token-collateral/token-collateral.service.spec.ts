import { Test, TestingModule } from '@nestjs/testing';
import { TokenCollateralService } from './token-collateral.service';

describe('TokenCollateralService', () => {
  let service: TokenCollateralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenCollateralService],
    }).compile();

    service = module.get<TokenCollateralService>(TokenCollateralService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
