import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DappContractEntity } from 'src/dapp-contract/dapp-contract.entity/dapp-contract.entity';
import { parseSQL } from 'src/helpers/formatQuery';
import { ReturnQueryType } from 'src/helpers/type';
import { TokenInfoEntity } from 'src/token-info/token-info.entity/token-info.entity';
import { TokenEntity } from 'src/token/token.entity/token.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTokenIouDTO } from './dto/create-token-iou.dto';
import { GetTokenIouBasicDTO } from './dto/get-token-iou-basic';
import { UpdateTokenIouDTO } from './dto/update-token-iou';
import { TokenIouEntity } from './token-iou.entity/token-iou.entity';
import { GetTokenIouDTO } from './dto/get-token-iou';
import { TokenOfficialEntity } from 'src/token-official/token-official.entity/token-official.entity';

@Injectable()
export class TokenIouService {
  constructor(
    @InjectRepository(TokenIouEntity)
    private readonly tokenIouEntity: Repository<TokenIouEntity>,
    private dataSource: DataSource
  ) {
    //
  }
  async getTokenIouBasicInfo(params: GetTokenIouBasicDTO): Promise<ReturnQueryType> {
    const { contract, dappId } = params;
    const conditions = {
      contract: contract?.toLowerCase(),
      dappContractId: dappId,
    }
    const query = await this.tokenIouEntity.query(`
    SELECT 
      iou.id, 
      iou.creator, 
      iou.circulatingSupply, 
      iou.collateralAmount, 
      iou.officialAmount, 
      iou.isPublicPool, 
      iou.deadline, 
      iou.tokenId, 
      iou.tokenCollateralId, 
      iou.tokenOfficialId,
      token.tokenDecimal 
    FROM 
      token_iou_table AS iou
    INNER JOIN 
      token_table AS token 
    ON 
      iou.tokenId = token.id
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
  async update(params: UpdateTokenIouDTO): Promise<ReturnQueryType> {
    const {
      id,
      dappId,
      totalSupplyCollateralToken,
      totalSupplyOfficialToken,
      totalSupplyPromiseToken,
      eventNumber
    } = params
    const query = await this.dataSource.transaction(async (e) => {
      const dappRow = await e.getRepository(DappContractEntity)
        .createQueryBuilder("dapp")
        .where("dapp.id = :id", { id: dappId })
        .getOne();
      const totalEventCalled = parseInt(dappRow.totalEventCalled);
      if (dappRow) {
        if (totalEventCalled === eventNumber - 1) {

          const inputTokenIou = {
            circulatingSupply: totalSupplyPromiseToken,
            collateralAmount: totalSupplyCollateralToken,
            officialAmount: totalSupplyOfficialToken
          }
          await e.createQueryBuilder().update(TokenIouEntity)
            .set(inputTokenIou)
            .where("id = :id", { id })
            .execute();
          await e.createQueryBuilder().update(DappContractEntity)
            .set({
              totalEventCalled: eventNumber
            })
            .where("id = :id", {
              id: dappId,
              eventNumber: eventNumber - 1
            })
            .execute();

          return {
            success: true,
            data: {
              id: id
            }
          }
        } else {
          throw { code: "EVENT_NUMBER_INVALID" };
        }
      }
      else {
        throw { code: "EMPTY_RESULT" };
      }

    }).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    })
    return query;
  }
  async create(params: CreateTokenIouDTO): Promise<ReturnQueryType> {
    const {
      tokenAddress,
      eventNumber,
      tokenName,
      tokenSymbol,
      dappId,
      tokenDecimal,
      creatorAddress,
      circulatingSupply,
      collateralAmount,
      deadline,
      tokenCollateralId,
      tokenOfficialId,
      isPublicPool
    } = params;

    const query: ReturnQueryType = await this.dataSource.transaction(async (e) => {
      const dappRow = await e.getRepository(DappContractEntity)
        .createQueryBuilder("dapp")
        .where("dapp.id = :id", { id: dappId })
        .getOne();
      const totalEventCalled = parseInt(dappRow.totalEventCalled);

      if (dappRow) {
        if (totalEventCalled === eventNumber - 1) {
          const inputTokenInfo = {
            tokenName,
            tokenSymbol
          }

          const tokenInfoInsert = await e.createQueryBuilder().insert().into(TokenInfoEntity)
            .values(inputTokenInfo)
            .execute();

          const inputTokenInsert = {
            contract: tokenAddress.toLowerCase(),
            tokenDecimal,
            tokenInfo: tokenInfoInsert.raw?.insertId,
            dappContract: dappId,
          }
          const tokenInsert = await e.createQueryBuilder().insert().into(TokenEntity)
            .values(inputTokenInsert)
            .execute();

          const inputTokenIou = {
            creator: creatorAddress.toLowerCase(),
            circulatingSupply,
            collateralAmount,
            officialAmount: 0,
            deadline,
            tokenCollateral: tokenCollateralId,
            tokenOfficial: tokenOfficialId,
            token: tokenInsert.raw?.insertId,
            isPublicPool,
          }
          const tokenIouInsert = await e.createQueryBuilder().insert().into(TokenIouEntity)
            .values(inputTokenIou)
            .execute();

          await e.createQueryBuilder().update(DappContractEntity)
            .set({
              totalEventCalled: eventNumber
            })
            .where("id = :id", {
              id: dappId,
              eventNumber: eventNumber - 1
            })
            .execute();
          await e.query(`
            UPDATE 
              token_official_table as oToken
            SET
              totalTokenCreated = totalTokenCreated + 1
            WHERE
              oToken.tokenId = ${tokenOfficialId}
          `);

          return {
            success: true,
            data: {
              id: tokenIouInsert.raw?.insertId,
              ...inputTokenIou
            }
          }
        }
        else {
          throw { code: "EVENT_NUMBER_INVALID" };
        }
      }
      else {
        throw { code: "EMPTY_RESULT" };
      }
    }).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    })

    return query;
  }

  //ui user
  async getTokenIou(params: GetTokenIouDTO) {
    const columnSort = {
      tokenName: true,
      circulatingSupply: true,
      collateralAmount: true,
      deadline: true,
      protectiveValue: true,
      estCollateral: true
    }

    const { index, limit, sort, column, chainId, tokenOfficial } = params;
    const limitString = parseSQL.limit({ index: index || 0, limit: limit || 100 });
    const orderByString = parseSQL.orderBy({ column, sort, columnAllowed: columnSort })
    const conditions = {
      ["oToken.contract"]: tokenOfficial?.toLowerCase(),
      chainId: chainId?.toString()
    }
    const totalRow = await this.tokenIouEntity.query(`
      SELECT
        count(iou.id) OVER() AS totalResult
      FROM 
        token_iou_table AS iou
      INNER JOIN 
        token_table AS iouToken
      ON 
        iou.tokenId = iouToken.id
      INNER JOIN
        token_info_table AS iouTokenInfo
      ON 
        iouToken.tokenInfoId = iouTokenInfo.id
      INNER JOIN 
        token_table AS oToken
      ON 
        iou.tokenOfficialId = oToken.id
      INNER JOIN
        token_info_table AS oTokenInfo
      ON 
        oToken.tokenInfoId = oTokenInfo.id
      INNER JOIN 
        dapp_contract_table AS dapp
      ON 
        iouToken.dappContractId = dapp.id
      INNER JOIN 
        chain_table AS chainTable
      ON 
        dapp.chainId = chainTable.id
      LEFT JOIN 
        token_collateral_table AS cToken
      ON 
        iou.tokenCollateralId = cToken.tokenId
      ${parseSQL.where(conditions)}
      LIMIT 1
    `).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    })
    const query = await this.tokenIouEntity.query(`
      SELECT
        dapp.id as dappId,
        iou.creator,
        iou.circulatingSupply,
        iou.collateralAmount,
        iou.officialAmount,
        iou.isPublicPool,
        iou.deadline,
        
        iouToken.contract,
        iouToken.tokenDecimal,
        iouTokenInfo.tokenName,
        iouTokenInfo.tokenSymbol,
        iouTokenInfo.logoURL,
        iouTokenInfo.websiteURL,
        collateralToken.contract as cTokenContract,
        
        chainTable.id as chainId,
        chainTable.blockExplorerURL,
        
        iou.collateralAmount * cToken.price AS estCollateral,
        iou.collateralAmount * cToken.price/circulatingSupply AS protectiveValue
   
      FROM 
        token_iou_table AS iou
      INNER JOIN 
        token_table AS iouToken
      ON 
        iou.tokenId = iouToken.id
      INNER JOIN
        token_info_table AS iouTokenInfo
      ON 
        iouToken.tokenInfoId = iouTokenInfo.id
      INNER JOIN 
        token_table AS oToken
      ON 
        iou.tokenOfficialId = oToken.id
      INNER JOIN
        token_info_table AS oTokenInfo
      ON 
        oToken.tokenInfoId = oTokenInfo.id
      INNER JOIN 
        token_table AS collateralToken
      ON 
        iou.tokenCollateralId = collateralToken.id
      INNER JOIN 
        dapp_contract_table AS dapp
      ON 
        iouToken.dappContractId = dapp.id
      INNER JOIN 
        chain_table AS chainTable
      ON 
        dapp.chainId = chainTable.id
      LEFT JOIN 
        token_collateral_table AS cToken
      ON 
        iou.tokenCollateralId = cToken.tokenId
      ${parseSQL.where(conditions)}
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
