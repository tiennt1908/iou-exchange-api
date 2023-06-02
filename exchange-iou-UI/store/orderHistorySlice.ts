import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import orderHistoryAPI, { GetChartParams, GetPriceInfoParams, GetPriceInfoResponse } from "../services/orderHistory";

type initialStateType = {
  chart: {
    list: [],
    timeRange: number,
    limit: number
  },
  priceInfo: GetPriceInfoResponse
}
const initialState: initialStateType = {
  chart: {
    list: [],
    timeRange: 3600,
    limit: 60
  },
  priceInfo: {
    openPrice: 0,
    lowPrice: 0,
    highPrice: 0,
    currentPrice: 0,
    volume: 0
  }
}
export const actAsyncGetPriceInfo = createAsyncThunk("order-history/price-info", async ({ dappId, tokenIn, tokenOut, timeRange }: GetPriceInfoParams, { rejectWithValue }) => {
  try {
    const priceInfo = await orderHistoryAPI.getPriceInfo({ dappId, tokenIn, tokenOut, timeRange });
    return priceInfo;
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncGetChartData = createAsyncThunk("order-history/chart", async ({ dappId, tokenIn, tokenOut, limit, timeRange }: GetChartParams, { rejectWithValue }) => {
  try {
    const data = await orderHistoryAPI.getCharts({ dappId, tokenIn, tokenOut, limit, timeRange });
    return data;
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder.addCase(actAsyncGetPriceInfo.fulfilled, (state, { payload }) => {
      state.priceInfo = payload;
    })
    builder.addCase(actAsyncGetChartData.fulfilled, (state, { payload }) => {
      state.chart.list = payload;
    })
  },
})
export default orderHistorySlice.reducer;