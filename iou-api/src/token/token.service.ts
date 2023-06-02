import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReturnQueryType } from 'src/helpers/type';
import { TokenInfoEntity } from 'src/token-info/token-info.entity/token-info.entity';
import { DataSource, Repository } from 'typeorm';
import { GetTokenBasicDTO } from './dto/get-token-basic.dto';
import { TokenEntity } from './token.entity/token.entity';
import { CreateTokenDTO } from './dto/create-token.dto';
import { parseSQL } from 'src/helpers/formatQuery';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenEntity: Repository<TokenEntity>,
    private dataSource: DataSource
  ) {
    //
  }

  async getTokenBasicInfo(params: GetTokenBasicDTO): Promise<ReturnQueryType> {
    const { dappId, contract, id } = params;
    const conditions = {
      contract: contract?.toLowerCase(),
      dappContractId: dappId,
      id
    }

    const query = await this.tokenEntity.query(`
    SELECT 
      * 
    FROM 
      token_table
    ${parseSQL.where(conditions)}
    `).catch((err) => {
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
  async create(params: CreateTokenDTO): Promise<ReturnQueryType> {
    const {
      tokenAddress,
      tokenName,
      tokenSymbol,
      tokenDecimal,
      dappId
    } = params;

    const query = await this.dataSource.transaction(async (e) => {
      const inputTokenInfo = {
        tokenName,
        tokenSymbol
      }

      const insertTokenInfo = await e.createQueryBuilder().insert().into(TokenInfoEntity)
        .values(inputTokenInfo)
        .execute();

      const inputTokenInsert = {
        contract: tokenAddress.toLowerCase(),
        tokenDecimal,
        tokenInfo: insertTokenInfo.raw?.insertId,
        dappContract: dappId
      }

      const tokenInsert = await e.createQueryBuilder().insert().into(TokenEntity)
        .values(inputTokenInsert)
        .execute();

      return {
        success: true,
        data: {
          id: tokenInsert.raw?.insertId,
          ...inputTokenInsert
        }
      }
    }).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    })

    return query;
  }
}