import { Test, TestingModule } from '@nestjs/testing';
import { TokenIouController } from './token-iou.controller';

describe('TokenIouController', () => {
  let controller: TokenIouController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenIouController],
    }).compile();

    controller = module.get<TokenIouController>(TokenIouController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
