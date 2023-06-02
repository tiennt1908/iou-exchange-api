import { Test, TestingModule } from '@nestjs/testing';
import { DappContractTypeService } from './dapp-contract-type.service';

describe('DappContractTypeService', () => {
  let service: DappContractTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DappContractTypeService],
    }).compile();

    service = module.get<DappContractTypeService>(DappContractTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
