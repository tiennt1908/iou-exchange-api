import axiosCustom from "./axiosCustom";

export interface GetOrderBookParams {
  dappId: number,
  tokenIn: string,
  tokenOut: string,
  decimal: number,
  column: string,
  sort: string,
  side: "sell" | "buy"
}
export interface OrderBookType {
  tokenInAmount: number,
  tokenOutAmount: number,
  price: number
}
export interface GetMathOrderParams {
  price: number,
  dappId: number,
  tokenIn: string,
  tokenOut: string,
  paymentAmount: number,
}
export interface MathOrderType {
  orderIdOnchain: number,
  orderAmount: number,
  price: number,
  cumulativeTotal: number
}
export interface GetMinPriceParams {
  dappId: number,
  tokenIn: string,
  tokenOut: string
}
export interface MinPriceResponse {
  minPrice: number
}
const orderBookAPI = {
  gets: async (params: GetOrderBookParams): Promise<OrderBookType[]> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("order-book/list", {
          params
        })
      return data || [];
    }
    catch (err: any) {
      console.log(err.response?.data, "OrderBook/gets");
      return [];
    }
  },
  getMathOrders: async (params: GetMathOrderParams): Promise<MathOrderType[]> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("order-book/order-match", {
          params
        })
      return data || [];
    }
    catch (err: any) {
      console.log(err.response?.data, "OrderBook/order-match");
      return [];
    }
  },
  getMinPrice: async (params: GetMinPriceParams): Promise<MinPriceResponse> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("order-book/min-price", {
          params
        })
      return data as MinPriceResponse;
    }
    catch (err: any) {
      console.log(err.response?.data, "OrderBook/min-price");
      return {
        minPrice: 0
      };
    }
  }
}
export default orderBookAPI;