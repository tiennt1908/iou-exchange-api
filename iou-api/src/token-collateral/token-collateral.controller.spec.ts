import { Test, TestingModule } from '@nestjs/testing';
import { TokenCollateralController } from './token-collateral.controller';

describe('TokenCollateralController', () => {
  let controller: TokenCollateralController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenCollateralController],
    }).compile();

    controller = module.get<TokenCollateralController>(TokenCollateralController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
