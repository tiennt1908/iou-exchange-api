import { Test, TestingModule } from '@nestjs/testing';
import { TokenInfoController } from './token-info.controller';

describe('TokenInfoController', () => {
  let controller: TokenInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenInfoController],
    }).compile();

    controller = module.get<TokenInfoController>(TokenInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
