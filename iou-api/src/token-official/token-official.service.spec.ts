import { Test, TestingModule } from '@nestjs/testing';
import { TokenOfficialService } from './token-official.service';

describe('TokenOfficialService', () => {
  let service: TokenOfficialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenOfficialService],
    }).compile();

    service = module.get<TokenOfficialService>(TokenOfficialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
