import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DappContractEntity } from 'src/dapp-contract/dapp-contract.entity/dapp-contract.entity';
import { parseSQL } from 'src/helpers/formatQuery';
import { ReturnQueryType } from 'src/helpers/type';
import { OrderHistoryEntity } from 'src/order-history/order-history.entity/order-history.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderBookDTO } from './dto/create-order-book.dto';
import { OrderBookExchangeDTO } from './dto/order-book-exchange.dto';
import { OrderBookDTO } from './dto/order-book.dto';
import { UpdateOrderBookDTO } from './dto/update-order-book.dto';
import { OrderBookEntity } from './order-book.entity/order-book.entity';
import { GetMatchOrderDTO } from './dto/get-match-order';
import { GetMinPriceDTO } from './dto/get-min-price.dto';
import { UpdateOrderStatusDTO } from './dto/update-order-status.dto';

@Injectable()
export class OrderBookService {
  constructor(
    @InjectRepository(OrderBookEntity)
    private readonly orderBookEntity: Repository<OrderBookEntity>,
    private dataSource: DataSource
  ) {
    //
  }

  async createOrderBook(params: CreateOrderBookDTO): Promise<ReturnQueryType> {
    const {
      dappId,
      eventNumber,
      orderIdOnChain,
      makerAddress,
      tokenInAmount,
      tokenOutAmount,
      createAt,
      tokenInAddress,
      tokenOutAddress,
      orderStatusId
    } = params;
    const query = await this.dataSource.transaction(async (e) => {
      const dappRow = await e.getRepository(DappContractEntity)
        .createQueryBuilder("dapp")
        .where("dapp.id = :id", { id: dappId })
        .getOne();
      const totalEventCalled = parseInt(dappRow.totalEventCalled);
      if (dappRow) {
        if (totalEventCalled === eventNumber - 1) {
          const orderbookInsert = await e.createQueryBuilder().insert().into(OrderBookEntity)
            .values({
              orderIdOnchain: orderIdOnChain,
              maker: makerAddress?.toLowerCase(),
              tokenInAmount: tokenInAmount,
              tokenOutAmount: tokenOutAmount,
              tokenInAmountSold: 0,
              createAt: createAt,
              tokenIn: tokenInAddress?.toLowerCase(),
              tokenOut: tokenOutAddress?.toLowerCase(),
              orderStatus: orderStatusId,
              dappContract: dappId
            })
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
              id: orderbookInsert.raw?.insertId,
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
  async updateActionTrade(params: UpdateOrderBookDTO): Promise<ReturnQueryType> {
    const {
      dappId,
      orderBookId,
      eventNumber,
      takerAddress,
      amount,
      estimateValue,
      orderAt,
      orderStatus
    } = params;
    const query = await this.dataSource.transaction(async (e) => {
      const dappRow = await e.getRepository(DappContractEntity)
        .createQueryBuilder("dapp")
        .where("dapp.id = :id", { id: dappId })
        .getOne();
      const totalEventCalled = parseInt(dappRow.totalEventCalled);

      if (dappRow) {
        if (totalEventCalled === eventNumber - 1) {
          const orderBookQuery = await this.getOrderBook({ id: orderBookId } as OrderBookDTO);
          const order = orderBookQuery.data[0];
          if (order) {
            const orderHistoryInsert = await e.createQueryBuilder().insert().into(OrderHistoryEntity)
              .values({
                taker: takerAddress,
                amount: amount,
                estimateValue,
                orderAt,
                orderBook: orderBookId,
              })
              .execute();

            const totalSold = order?.tokenInAmountSold + amount;
            const orderBookParams = {
              tokenInAmountSold: totalSold,
              orderStatus: orderStatus
            }

            await e.createQueryBuilder().update(OrderBookEntity)
              .set(orderBookParams)
              .where("id = :id", {
                id: orderBookId,
              })
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
                orderHistoryId: orderHistoryInsert.raw?.insertId,
              }
            }
          }
          else {
            throw { code: "ACTION_NOT_ALLOW" };
          }
        }
        else {
          throw { code: "EVENT_NUMBER_INVALID" };
        }
      } else {
        throw { code: "EMPTY_RESULT" };
      }
    })
    return query;
  }
  async updateOrderStatus(params: UpdateOrderStatusDTO): Promise<ReturnQueryType> {
    const {
      dappId,
      orderBookId,
      eventNumber,
      orderStatus
    } = params;
    const query = await this.dataSource.transaction(async (e) => {
      const dappRow = await e.getRepository(DappContractEntity)
        .createQueryBuilder("dapp")
        .where("dapp.id = :id", { id: dappId })
        .getOne();
      const totalEventCalled = parseInt(dappRow.totalEventCalled);

      if (dappRow) {
        if (totalEventCalled === eventNumber - 1) {
          const orderBookQuery = await this.getOrderBook({ id: orderBookId } as OrderBookDTO);
          const order = orderBookQuery.data[0];
          if (order) {
            const orderBookParams = {
              orderStatus: orderStatus
            }
            await e.createQueryBuilder().update(OrderBookEntity)
              .set(orderBookParams)
              .where("id = :id", {
                id: orderBookId,
              })
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
                orderBookId
              }
            }
          }
          else {
            throw { code: "ACTION_NOT_ALLOW" };
          }
        }
        else {
          throw { code: "EVENT_NUMBER_INVALID" };
        }
      } else {
        throw { code: "EMPTY_RESULT" };
      }
    })
    return query;
  }
  async getOrderBook(params: OrderBookDTO): Promise<ReturnQueryType> {
    const { id, orderIdOnchain, maker, tokenIn, tokenOut, orderStatusId, dappId } = params;
    const conditions = {
      id,
      orderIdOnchain,
      maker: maker?.toLowerCase(),
      tokenIn: tokenIn?.toLowerCase(),
      tokenOut: tokenOut?.toLowerCase(),
      orderStatusId,
      dappContractId: dappId,
    }
    const query = await this.orderBookEntity.query(`SELECT * FROM order_book_table ${parseSQL.where(conditions)}`).catch((err) => {
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


  async getOrderBookExchange(params: OrderBookExchangeDTO): Promise<ReturnQueryType> {
    const { tokenIn, tokenOut, decimal, dappId, column, sort, side } = params;
    const conditions = {
      tokenIn: side === "sell" ? tokenIn?.toLowerCase() : tokenOut?.toLowerCase(),
      tokenOut: side === "sell" ? tokenOut?.toLowerCase() : tokenIn?.toLowerCase(),
      orderStatusId: 1,
      dappContractId: dappId
    }
    const orderByString = parseSQL.orderBy({ column, sort, columnAllowed: { price: true } })
    const priceSelect = side === "sell" ? `tokenOutAmount/tokenInAmount` : `tokenInAmount/tokenOutAmount`;
    const tokenInAmount = side === "sell" ? `SUM(tokenInAmount - tokenInAmountSold)` : `SUM(tokenOutAmount-tokenOutAmount*(tokenInAmountSold/tokenInAmount))`;
    const tokenOutAmount = side === "sell" ? `SUM(tokenOutAmount)` : `SUM(tokenInAmount - tokenInAmountSold)`;
    const round = side === "sell" ? `CEIL` : `FLOOR`;
    const query = await this.orderBookEntity.query(`
      SELECT 
        ${tokenInAmount} as tokenInAmount,
        ${tokenOutAmount} as tokenOutAmount,
        ${round}((${priceSelect})*${10 ** decimal})/${10 ** decimal} AS price
      FROM 
        order_book_table
        ${parseSQL.where(conditions)}
      GROUP BY price
        ${orderByString}
      LIMIT 15
      `)
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
  async getMatchOrders(params: GetMatchOrderDTO): Promise<ReturnQueryType> {
    const { tokenIn, tokenOut, dappId, paymentAmount, price } = params;
    const conditions = {
      tokenIn: tokenIn?.toLowerCase(),
      tokenOut: tokenOut?.toLowerCase(),
      orderStatusId: 1,
      dappContractId: dappId,
    }

    const query = await this.orderBookEntity.query(`
    SELECT
      orderIdOnchain,
      tokenInAmount - tokenInAmountSold AS orderAmount,
      @total := @total - (tokenOutAmount - tokenInAmountSold*(tokenOutAmount/tokenInAmount)) AS cumulativeTotal,
      (tokenOutAmount/tokenInAmount) AS price
    FROM
      (
        SELECT 
          * 
        FROM 
          order_book_table 
        ORDER BY 
          (tokenOutAmount/tokenInAmount) ASC
      ) AS obt
    JOIN (SELECT @total := ${paymentAmount}) tableJoin
      ${parseSQL.where(conditions)}
    AND 
      @total >= 0
    AND
      (tokenOutAmount/tokenInAmount) <= ${price}
    LIMIT 25
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
  async getMinPrice(params: GetMinPriceDTO): Promise<ReturnQueryType> {
    const { tokenIn, tokenOut, dappId } = params;
    const conditions = {
      ["tokenIn"]: tokenIn?.toLowerCase(),
      ["tokenOut"]: tokenOut?.toLowerCase(),
      ["dappContractId"]: dappId,
      orderStatusId: 1
    }
    const query = await this.orderBookEntity.query(`
      SELECT
        MIN(tokenOutAmount/tokenInAmount) AS price
      FROM
        order_book_table
      ${parseSQL.where(conditions)}
    `).catch((err) => {
      throw new HttpException({
        success: false,
        data: err
      }, HttpStatus.FORBIDDEN);
    });
    return {
      success: true,
      data: {
        minPrice: query[0]?.price || 0
      }
    };
  }
}
