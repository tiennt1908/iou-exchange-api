import { Test, TestingModule } from '@nestjs/testing';
import { TokenOfficialController } from './token-official.controller';

describe('TokenOfficialController', () => {
  let controller: TokenOfficialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenOfficialController],
    }).compile();

    controller = module.get<TokenOfficialController>(TokenOfficialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
