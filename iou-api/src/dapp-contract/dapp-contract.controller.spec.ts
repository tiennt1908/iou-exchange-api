import { Test, TestingModule } from '@nestjs/testing';
import { DappContractController } from './dapp-contract.controller';

describe('DappContractController', () => {
  let controller: DappContractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DappContractController],
    }).compile();

    controller = module.get<DappContractController>(DappContractController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
