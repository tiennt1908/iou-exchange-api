import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChainEntity } from './chain.entity/chain.entity';
import { Repository } from 'typeorm';
import { CreateChainDTO } from './dto/create-chain.dto';
import { ReturnQueryType } from 'src/helpers/type';
import { GetChainDTO } from './dto/get-chain.dto';
import { parseSQL } from 'src/helpers/formatQuery';

@Injectable()
export class ChainService {
  constructor(
    @InjectRepository(ChainEntity)
    private readonly chainEntity: Repository<ChainEntity>,
  ) { }
  async getChains(params: GetChainDTO): Promise<ReturnQueryType> {
    const { index, limit } = params;
    const limitString = parseSQL.limit({ index: index || 0, limit: limit || 20 });
    const query = await this.chainEntity.query(`
      SELECT
        *
      FROM
        chain_table
      ${limitString}
    `).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    })
    return {
      success: true,
      data: query || []
    };
  }
}