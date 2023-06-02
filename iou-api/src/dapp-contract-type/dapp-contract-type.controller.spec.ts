import { Test, TestingModule } from '@nestjs/testing';
import { DappContractTypeController } from './dapp-contract-type.controller';

describe('DappContractTypeController', () => {
  let controller: DappContractTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DappContractTypeController],
    }).compile();

    controller = module.get<DappContractTypeController>(DappContractTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
