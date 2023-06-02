import { Test, TestingModule } from '@nestjs/testing';
import { TokenIouService } from './token-iou.service';

describe('TokenIouService', () => {
  let service: TokenIouService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenIouService],
    }).compile();

    service = module.get<TokenIouService>(TokenIouService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
