import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateIOUContract } from './services/contracts/create-iou-contract';
import { DappContracts } from './services/dapp';
import { EventData } from 'web3-eth-contract';
import { TradeContract } from './services/contracts/trade-contract';
import { ERC20Contract } from './services/contracts/ERC20-contract';
import { OrderBookService } from './services/orderbook';
import { TokenIouAPI } from './services/token-iou';
import { TokenAPI } from './services/token';

@Injectable()
export class AppService {
  sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  constructor(
    private readonly dappContracts: DappContracts,
    private readonly tokenAPI: TokenAPI,
    private readonly tokenIouAPI: TokenIouAPI,
    private readonly orderBookService: OrderBookService,
  ) {
    //
  }

  async fetchIOUData(smartContract: any) {
    const { contract, rpcURL, totalEventCalled, dappId } = smartContract;
    const lastEventCalled = parseInt(totalEventCalled);
    const createIouContract = new CreateIOUContract(rpcURL, contract);
    const eventCount = parseInt(await createIouContract.getEventCount());
    if (lastEventCalled < eventCount) {
      const blockNumber = await createIouContract.getBlockNumber(
        lastEventCalled + 1,
      );
      const allEvents = await createIouContract.contract.getPastEvents(
        'HistoryEvent',
        {
          fromBlock: blockNumber,
          toBlock: blockNumber,
        },
      );
      //loop event
      let j = 0;
      for (j = 0; j < allEvents.length; j++) {
        const { returnValues } = allEvents[j];

        const tokenIou = await this.tokenIouAPI.get({
          tokenContract: returnValues?.token,
          dappId,
        });

        const {
          totalSupplyPromiseToken,
          totalSupplyCollateralToken,
          totalSupplyOfficialToken,
          collateralToken,
          officialToken,
          creator,
          isPublicPool,
          deadline,
        } = await createIouContract.getTokenByAddress(returnValues?.token);

        const dapp = await this.dappContracts.get({ id: dappId });
        const nextEventNumber = parseInt(dapp?.totalEventCalled) + 1;
        if (nextEventNumber === parseInt(returnValues?.id)) {
          if (tokenIou) {
            const oToken = await this.tokenAPI.getTokenBasic({
              tokenContract: officialToken,
              dappId,
            });
            const cToken = await this.tokenAPI.getTokenBasic({
              tokenContract: collateralToken,
              dappId,
            });
            this.tokenIouAPI.update({
              dappId,
              id: tokenIou?.id,
              totalSupplyOfficialToken:
                totalSupplyOfficialToken / 10 ** oToken?.tokenDecimal,
              totalSupplyPromiseToken:
                totalSupplyPromiseToken / 10 ** tokenIou?.tokenDecimal,
              totalSupplyCollateralToken:
                totalSupplyCollateralToken / 10 ** cToken?.tokenDecimal,
              eventNumber: nextEventNumber,
            });
          } else {
            const cTokenERC20 = new ERC20Contract(rpcURL, collateralToken);
            const cTokenDecimal = parseInt(await cTokenERC20.getDecimals());
            const oTokenERC20 = new ERC20Contract(rpcURL, officialToken);
            const oTokenDecimal = parseInt(await oTokenERC20.getDecimals());

            const pTokenERC20 = new ERC20Contract(rpcURL, returnValues?.token);
            const pTokenDecimal = parseInt(await pTokenERC20.getDecimals());
            const pTokenName = await pTokenERC20.getName();
            const pTokenSymbol = await pTokenERC20.getSymbol();

            let cTokenData = await this.tokenAPI.getTokenBasic({
              tokenContract: collateralToken,
              dappId,
            });

            let oTokenData = await this.tokenAPI.getTokenBasic({
              tokenContract: officialToken,
              dappId,
            });

            if (!cTokenData) {
              const cTokenName = await cTokenERC20.getName();
              const cTokenSymbol = await cTokenERC20.getSymbol();
              const { success, data } = await this.tokenAPI.create({
                dappId,
                tokenAddress: collateralToken,
                tokenName: cTokenName,
                tokenSymbol: cTokenSymbol,
                tokenDecimal: cTokenDecimal,
              });
              if (success) {
                cTokenData = data;
              }
            }
            if (!oTokenData) {
              const oTokenName = await oTokenERC20.getName();
              const oTokenSymbol = await oTokenERC20.getSymbol();
              const { success, data } = await this.tokenAPI.create({
                dappId,
                tokenAddress: officialToken,
                tokenName: oTokenName,
                tokenSymbol: oTokenSymbol,
                tokenDecimal: oTokenDecimal,
              });
              if (success) {
                oTokenData = data;
              }
            }
            this.tokenIouAPI.create({
              dappId,
              eventNumber: nextEventNumber,
              tokenAddress: returnValues?.token,
              tokenName: pTokenName,
              tokenSymbol: pTokenSymbol,
              tokenDecimal: pTokenDecimal,
              creatorAddress: creator,
              circulatingSupply: totalSupplyPromiseToken / 10 ** pTokenDecimal,
              collateralAmount:
                totalSupplyCollateralToken / 10 ** cTokenData?.tokenDecimal,
              tokenCollateralId: cTokenData?.id,
              tokenOfficialId: oTokenData?.id,
              isPublicPool,
              deadline: parseInt(deadline),
            });
          }
        }
      }
    }
  }
  async fetchTradeData(smartContract: any) {
    const { contract, rpcURL, totalEventCalled, dappId } = smartContract;
    const lastEventCalled = parseInt(totalEventCalled);

    const tradeContract = new TradeContract(rpcURL, contract);
    const eventCount = parseInt(await tradeContract.getEventCount());

    if (lastEventCalled < eventCount) {
      const blockNumber = await tradeContract.getBlockNumber(
        lastEventCalled + 1,
      );
      const allEvents = await tradeContract.contract.getPastEvents(
        'OrderHistory',
        {
          fromBlock: blockNumber,
          toBlock: blockNumber,
        },
      );
      //loop event
      let j = 0;
      for (j = 0; j < allEvents.length; j++) {
        const {
          returnValues: {
            id,
            orderId,
            maker,
            taker,
            tokenIn,
            tokenOut,
            tokenInAmount,
            tokenOutAmount,
            datetime,
            status,
          },
        } = allEvents[j];
        const dapp = await this.dappContracts.get({ id: dappId });
        const nextEventNumber = parseInt(dapp?.totalEventCalled) + 1;
        const order = await this.orderBookService.getOrderByOnchainData({
          dappId,
          orderIdOnchain: parseInt(orderId),
        });
        if (nextEventNumber === parseInt(id)) {
          if (parseInt(status) !== 3) {
            const tokenInERC20 = new ERC20Contract(rpcURL, tokenIn);
            const tokenInDecimal = parseInt(await tokenInERC20.getDecimals());

            const tokenOutERC20 = new ERC20Contract(rpcURL, tokenOut);
            const tokenOutDecimal = parseInt(await tokenOutERC20.getDecimals());

            //fix orderStatus
            if (order) {
              const priceTokenOut = 1;
              await this.orderBookService.updateOrderBook({
                dappId: parseInt(dappId),
                eventNumber: nextEventNumber,
                takerAddress: taker,
                amount: tokenInAmount / 10 ** tokenInDecimal,
                estimateValue:
                  (tokenOutAmount / 10 ** tokenOutDecimal) * priceTokenOut,
                orderAt: parseInt(datetime),
                orderBookId: parseInt(order?.id),
                orderStatus: status,
              });
              //
            } else {
              await this.orderBookService.createNewOrderBook({
                dappId: parseInt(dappId),
                eventNumber: nextEventNumber,
                orderIdOnChain: parseInt(orderId),
                makerAddress: maker,
                tokenInAmount: tokenInAmount / 10 ** tokenInDecimal,
                tokenOutAmount: tokenOutAmount / 10 ** tokenOutDecimal,
                createAt: parseInt(datetime),
                tokenInAddress: tokenIn,
                tokenOutAddress: tokenOut,
                orderStatusId: 1,
              });
            }
          } else if (parseInt(status) === 3) {
            await this.orderBookService.updateOrderStatus({
              dappId: parseInt(dappId),
              eventNumber: nextEventNumber,
              orderBookId: parseInt(order?.id),
              orderStatus: '3',
            });
          }
        }
      }
    }
  }
  async fetchIOUEvents() {
    const contracts = await this.dappContracts
      .gets({
        index: 0,
        limit: 25,
        typeId: 1,
      })
      .catch((err) => {
        console.log(err?.message);
        return [];
      });
    let i = 0;
    for (i = 0; i < contracts.length; i++) {
      const {
        id,
        contract,
        totalEventCalled,
        typeId,
        chainId,
        chainName,
        rpcURL,
      } = contracts[i];
      const dappContract = {
        dappId: id,
        contract,
        totalEventCalled: parseInt(totalEventCalled),
        typeId,
        chainId: parseInt(chainId),
        chainName,
        rpcURL,
      };
      this.fetchIOUData(dappContract).catch((err) => {
        console.log(err?.message);
      });
    }
    await this.sleep(5000);
    this.fetchIOUEvents();
  }
  async fetchTradeEvents() {
    const contracts = await this.dappContracts
      .gets({
        index: 0,
        limit: 25,
        typeId: 2,
      })
      .catch((err) => {
        console.log(err?.message);
        return [];
      });
    let i = 0;
    for (i = 0; i < contracts.length; i++) {
      const {
        id,
        contract,
        totalEventCalled,
        typeId,
        chainId,
        chainName,
        rpcURL,
      } = contracts[i];
      const dappContract = {
        dappId: id,
        contract,
        totalEventCalled: parseInt(totalEventCalled),
        typeId,
        chainId: parseInt(chainId),
        chainName,
        rpcURL,
      };
      this.fetchTradeData(dappContract).catch((err) => {
        console.log(err?.message);
      });
    }
    await this.sleep(1500);
    this.fetchTradeEvents();
  }
}
