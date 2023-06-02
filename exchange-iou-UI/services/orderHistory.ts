import axiosCustom from "./axiosCustom";
export type GetChartParams = {
  dappId: number,
  tokenIn: string,
  tokenOut: string,
  limit: number,
  timeRange: number
}
export type GetPriceInfoParams = {
  dappId: number,
  tokenIn: string,
  tokenOut: string,
  timeRange: number
}
export type GetPriceInfoResponse = {
  openPrice: number,
  lowPrice: number,
  highPrice: number,
  currentPrice: number,
  volume: number
}
export type GetChartResponse = {
  tradeAt: string,
  price: number
}
const orderHistoryAPI = {
  getCharts: async ({ dappId, tokenIn, tokenOut, limit, timeRange }: GetChartParams) => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("order-history/chart", {
          params: {
            dappId,
            tokenIn,
            tokenOut,
            limit,
            timeRange
          }
        })
      const formatData = data?.map((e: GetChartResponse) => {
        return [
          parseInt(e.tradeAt) * 1000,
          e.price
        ]
      })
      return formatData || [];
    }
    catch (err: any) {
      console.log(err.response?.data, "OrderHistory/chart");
      return [];
    }
  },
  getPriceInfo: async ({ dappId, tokenIn, tokenOut, timeRange }: GetPriceInfoParams): Promise<GetPriceInfoResponse> => {
    try {
      const { data: { data, success } } = await axiosCustom.request()
        .get("order-history/price-info", {
          params: {
            dappId,
            tokenIn,
            tokenOut,
            timeRange
          }
        })
      return data as GetPriceInfoResponse;
    }
    catch (err: any) {
      console.log(err.response?.data, "OrderHistory/chart");
      return {
        openPrice: 0,
        lowPrice: 0,
        highPrice: 0,
        currentPrice: 0,
        volume: 0
      };
    }
  }
}
export default orderHistoryAPI;