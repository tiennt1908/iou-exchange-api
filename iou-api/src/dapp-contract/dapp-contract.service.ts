import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DappContractEntity } from './dapp-contract.entity/dapp-contract.entity';
import { Repository } from 'typeorm';
import { ReturnQueryType } from 'src/helpers/type';
import { DappConditionsDTO } from './dto/dapp-contract-conditions.dto';
import { parseSQL } from 'src/helpers/formatQuery';

@Injectable()
export class DappContractService {
  constructor(
    @InjectRepository(DappContractEntity)
    private readonly dappContractEntity: Repository<DappContractEntity>,
  ) {

  }
  async getDappContracts(dappConditionsDTO: DappConditionsDTO): Promise<ReturnQueryType> {
    const { id, contract, typeId, chainId } = dappConditionsDTO;
    const conditions = {
      ["dct.id"]: id,
      contract: contract?.toLowerCase(),
      typeId,
      chainId: chainId?.toString()
    }
    const query = await this.dappContractEntity.query(`
      SELECT 
        dct.id, 
        contract, 
        totalEventCalled, 
        typeId, 
        chainId, 
        chainName, 
        rpcURL 
      FROM 
        dapp_contract_table as dct 
      INNER JOIN 
        chain_table as ct 
      ON 
        dct.chainId = ct.id 
      ${parseSQL.where(conditions)}`)
      .catch((err) => {
        throw new HttpException({
          success: false,
          data: err
        }, HttpStatus.FORBIDDEN);
      });

    return {
      success: true,
      data: query || []
    };
  }
}
