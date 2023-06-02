import { Test, TestingModule } from '@nestjs/testing';
import { TokenInfoService } from './token-info.service';

describe('TokenInfoService', () => {
  let service: TokenInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenInfoService],
    }).compile();

    service = module.get<TokenInfoService>(TokenInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
