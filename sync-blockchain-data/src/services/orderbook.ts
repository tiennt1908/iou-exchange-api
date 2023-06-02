import axiosCustom from './axiosCustom';

export class OrderBookService {
  async getOrderByOnchainData({ orderIdOnchain, dappId }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom.request().get('order-book/list/on-chain', {
      params: {
        dappId,
        orderIdOnchain,
      },
    });
    return success && data[0] ? data[0] : null;
  }
  async createNewOrderBook({
    dappId,
    eventNumber,
    orderIdOnChain,
    makerAddress,
    tokenInAmount,
    tokenOutAmount,
    createAt,
    tokenInAddress,
    tokenOutAddress,
    orderStatusId,
  }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .requestSignature()
      .post('order-book/create', {
        dappId,
        eventNumber,
        orderIdOnChain,
        makerAddress,
        tokenInAmount,
        tokenOutAmount,
        createAt,
        tokenInAddress,
        tokenOutAddress,
        orderStatusId,
      })
      .catch((err) => {
        console.log(err.response.data);
        return { data: err.response.data, success: false };
      });
    return { data, success };
  }
  async updateOrderBook({
    dappId,
    eventNumber,
    takerAddress,
    amount,
    estimateValue,
    orderAt,
    orderBookId,
    orderStatus,
  }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .requestSignature()
      .put('order-book/update', {
        dappId,
        eventNumber,
        takerAddress,
        amount,
        estimateValue,
        orderAt,
        orderBookId,
        orderStatus,
      })
      .catch((err) => {
        console.log(err.response.data);
        return { data: err.response.data, success: false };
      });
    return { data, success };
  }
  async updateOrderStatus({
    dappId,
    eventNumber,
    orderBookId,
    orderStatus,
  }): Promise<any> {
    const {
      data: { data, success },
    } = await axiosCustom
      .requestSignature()
      .put('order-book/update/status', {
        dappId,
        eventNumber,
        orderBookId,
        orderStatus,
      })
      .catch((err) => {
        console.log(err.response.data);
        return { data: err.response.data, success: false };
      });
    return { data, success };
  }
}
