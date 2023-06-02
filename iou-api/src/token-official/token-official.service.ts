import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetTokenOfficialDTO } from './dto/get-token-official.dto';
import { ReturnQueryType } from 'src/helpers/type';
import { parseSQL } from 'src/helpers/formatQuery';
import { TokenOfficialEntity } from './token-official.entity/token-official.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TokenOfficialService {
  constructor(
    @InjectRepository(TokenOfficialEntity)
    private readonly tokenOfficialEntity: Repository<TokenOfficialEntity>,
    private dataSource: DataSource
  ) {
    //
  }

  async getTokenOfficial(params: GetTokenOfficialDTO): Promise<ReturnQueryType> {
    const columnSort = {
      tokenName: true,
      totalTokenCreated: true,
      chainName: true,
      totalCollateralValue: true
    }
    const { index, limit, sort, column, chainId } = params;
    const limitString = parseSQL.limit({ index: index || 0, limit: limit || 20 });
    const orderByString = parseSQL.orderBy({ column, sort, columnAllowed: columnSort })
    const conditions = {
      chainId: chainId?.toString()
    }
    const totalRow = await this.tokenOfficialEntity.query(`
      SELECT
        count(oToken.tokenId) OVER() AS totalResult
      FROM
        token_official_table AS oToken
    
      INNER JOIN
        token_table AS oTokenDetail
      ON 
        oToken.tokenId = oTokenDetail.id
      INNER JOIN
        token_info_table AS oTokenInfo
      ON 
        oTokenDetail.tokenInfoId = oTokenInfo.id
      INNER JOIN
        token_iou_table AS tokenIou
      ON 
        oToken.tokenId = tokenIou.tokenOfficialId
      INNER JOIN 
        dapp_contract_table AS dapp
      ON 
        oTokenDetail.dappContractId = dapp.id
      INNER JOIN 
        chain_table AS chainTable
      ON 
        dapp.chainId = chainTable.id
      LEFT JOIN 
        token_collateral_table AS cToken
      ON 
        tokenIou.tokenCollateralId = cToken.tokenId
      ${parseSQL.where(conditions)}
      GROUP BY(oToken.tokenId)
      LIMIT 1
    `).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    });

    const query = await this.tokenOfficialEntity.query(`
      SELECT
        oToken.tokenId,
        oToken.totalTokenCreated,
        oTokenDetail.contract,
        oTokenInfo.tokenName,
        oTokenInfo.tokenSymbol,
        oTokenInfo.logoURL,
        oTokenInfo.websiteURL,
        SUM(tokenIou.collateralAmount * cToken.price) AS totalCollateralValue,
        
        chainTable.chainName,
        chainTable.id as chainId,
        chainTable.blockExplorerURL
    
      FROM
        token_official_table AS oToken
    
      INNER JOIN
        token_table AS oTokenDetail
      ON 
        oToken.tokenId = oTokenDetail.id
      INNER JOIN
        token_info_table AS oTokenInfo
      ON 
        oTokenDetail.tokenInfoId = oTokenInfo.id
      INNER JOIN
        token_iou_table AS tokenIou
      ON 
        oToken.tokenId = tokenIou.tokenOfficialId
      INNER JOIN 
        dapp_contract_table AS dapp
      ON 
        oTokenDetail.dappContractId = dapp.id
      INNER JOIN 
        chain_table AS chainTable
      ON 
        dapp.chainId = chainTable.id
      LEFT JOIN 
        token_collateral_table AS cToken
      ON 
        tokenIou.tokenCollateralId = cToken.tokenId
      ${parseSQL.where(conditions)}
      GROUP BY(oToken.tokenId)
      ${orderByString}
      ${limitString}
    `).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    });

    return {
      success: true,
      data: {
        total: totalRow[0]?.totalResult * 1 || 0,
        data: query || []
      }
    };
  }
}
