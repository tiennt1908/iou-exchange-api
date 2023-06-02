import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderHistoryEntity } from './order-history.entity/order-history.entity';
import { DataSource, Repository } from 'typeorm';
import { ReturnQueryType } from 'src/helpers/type';
import { GetChartDTO } from './dto/get-chart.dto';
import { parseSQL } from 'src/helpers/formatQuery';
import { GetPriceInfoDTO } from './dto/get-price-info.dto';

@Injectable()
export class OrderHistoryService {
  constructor(
    @InjectRepository(OrderHistoryEntity)
    private readonly orderHistoryEntity: Repository<OrderHistoryEntity>,
    private dataSource: DataSource
  ) {
  }

  async getChartData(params: GetChartDTO): Promise<ReturnQueryType> {
    const { tokenIn, tokenOut, dappId, limit, timeRange } = params;
    const conditionMainToken = {
      ["obt.tokenIn"]: tokenIn?.toLowerCase(),
      ["obt.tokenOut"]: tokenOut?.toLowerCase(),
      ["obt.dappContractId"]: dappId
    }
    const conditionSubToken = {
      ["obt.tokenIn"]: tokenOut?.toLowerCase(),
      ["obt.tokenOut"]: tokenIn?.toLowerCase(),
      ["obt.dappContractId"]: dappId
    }
    const query = await this.orderHistoryEntity.query(`
    SELECT
      FLOOR(orderAt/${timeRange})*${timeRange} AS tradeAt,
      price
    FROM(
      SELECT
        oht.id,
        oht.orderAt,
        obt.tokenOutAmount/obt.tokenInAmount AS price
      FROM
        order_history_table as oht
      INNER JOIN 
        order_book_table AS obt
        ON  oht.orderBookId = obt.id
        ${parseSQL.where(conditionMainToken)}
      UNION ALL
      
      SELECT
        oht.id,
        oht.orderAt,
        obt.tokenInAmount/obt.tokenOutAmount AS price
      FROM
        order_history_table as oht
      INNER JOIN 
        order_book_table AS obt
        ON  oht.orderBookId = obt.id
        ${parseSQL.where(conditionSubToken)}
      ORDER BY id DESC
    ) AS priceTable
    GROUP BY 
      tradeAt
    ORDER BY 
      tradeAt ASC 
    LIMIT ${limit}
    `).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    });
    return {
      success: true,
      data: query || []
    };;
  }
  async getPriceInfo(params: GetPriceInfoDTO): Promise<ReturnQueryType> {
    const { tokenIn, tokenOut, dappId, timeRange } = params;
    const conditionMainToken = {
      ["obt.tokenIn"]: tokenIn?.toLowerCase(),
      ["obt.tokenOut"]: tokenOut?.toLowerCase(),
      ["obt.dappContractId"]: dappId
    }
    const conditionSubToken = {
      ["obt.tokenIn"]: tokenOut?.toLowerCase(),
      ["obt.tokenOut"]: tokenIn?.toLowerCase(),
      ["obt.dappContractId"]: dappId
    }
    const query = await this.dataSource.transaction(async (e) => {
      const priceInfo = await e.query(`
        SELECT
          tablePrice.price AS currentPrice,
          MIN(tablePrice.price) lowPrice,
          MAX(tablePrice.price) highPrice
        FROM(
          SELECT
            oht.id,
            oht.orderAt,
            obt.tokenOutAmount/obt.tokenInAmount AS price
          FROM
            order_history_table as oht
          INNER JOIN 
            order_book_table AS obt
          ON  
            oht.orderBookId = obt.id
          ${parseSQL.where(conditionMainToken)}

          UNION ALL
          
          SELECT
            oht.id,
            oht.orderAt,
            obt.tokenInAmount/obt.tokenOutAmount AS price
          FROM
            order_history_table as oht
          INNER JOIN 
            order_book_table AS obt
          ON  
            oht.orderBookId = obt.id
          ${parseSQL.where(conditionSubToken)}
          ORDER BY id DESC
        ) AS tablePrice
        WHERE
          tablePrice.orderAt >= UNIX_TIMESTAMP() - ${timeRange}
        LIMIT 1
      `)
      const openPrice = await e.query(`
        SELECT
          price AS openPrice
        FROM(
          SELECT
            oht.id,
            oht.orderAt,
            obt.tokenOutAmount/obt.tokenInAmount AS price
          FROM
            order_history_table as oht
          INNER JOIN 
            order_book_table AS obt
          ON  
            oht.orderBookId = obt.id
          ${parseSQL.where(conditionMainToken)}

          UNION ALL
          
          SELECT
            oht.id,
            oht.orderAt,
            obt.tokenInAmount/obt.tokenOutAmount AS price
          FROM
            order_history_table as oht
          INNER JOIN 
            order_book_table AS obt
          ON  
            oht.orderBookId = obt.id
          ${parseSQL.where(conditionSubToken)}
          ORDER BY id ASC
        ) as tablePrice
        WHERE
          tablePrice.orderAt >= UNIX_TIMESTAMP() - ${timeRange}
        LIMIT 1
      `)
      const volume = await e.query(`
        SELECT
          SUM(price * tokenAmount) AS volume
        FROM(
          SELECT
            oht.id,
            oht.orderAt,
            oht.amount AS tokenAmount,
            obt.tokenOutAmount/obt.tokenInAmount AS price
          FROM
            order_history_table as oht
          INNER JOIN 
            order_book_table AS obt
          ON  
            oht.orderBookId = obt.id
          ${parseSQL.where(conditionMainToken)}
            
          UNION ALL
          
          SELECT
            oht.id,
            oht.orderAt,
            oht.amount/(obt.tokenInAmount/obt.tokenOutAmount) AS tokenAmount,
            obt.tokenInAmount/obt.tokenOutAmount AS price
          FROM
            order_history_table as oht
          INNER JOIN 
            order_book_table AS obt
          ON  
            oht.orderBookId = obt.id
          ${parseSQL.where(conditionSubToken)}
          ORDER BY id ASC
        ) as tablePrice
        WHERE
          tablePrice.orderAt >= UNIX_TIMESTAMP() - ${timeRange}
      `)
      return {
        openPrice: openPrice[0]?.openPrice * 1 || 0,
        currentPrice: priceInfo[0]?.currentPrice * 1 || 0,
        lowPrice: priceInfo[0]?.lowPrice * 1 || 0,
        highPrice: priceInfo[0]?.highPrice * 1 || 0,
        volume: volume[0]?.volume * 1 || 0
      }
    }).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    })
    return {
      success: true,
      data: query
    };
  }
}
