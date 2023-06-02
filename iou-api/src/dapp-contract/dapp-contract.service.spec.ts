import { Test, TestingModule } from '@nestjs/testing';
import { DappContractService } from './dapp-contract.service';

describe('DappContractService', () => {
  let service: DappContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DappContractService],
    }).compile();

    service = module.get<DappContractService>(DappContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
