import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ERC20API } from "../contractAPI/ERC20";
import orderBookAPI, { GetMinPriceParams, GetOrderBookParams, OrderBookType } from "../services/orderBook";
import { format } from "../helpers/format";

type InitialStateType = {
  order: {
    sell: OrderBookType[],
    buy: OrderBookType[]
  },
  side: boolean,
  priceSelected: {
    buy: {
      price: number,
      trigger: boolean
    },
    sell: {
      price: number,
      trigger: boolean
    }
  },
  pair: {
    [key: string]: {
      contract: string
      symbol: string
      name: string
      decimals: number
    }
  },
  decimals: {
    form: number,
    orderbook: number
  }
}
type GetPairParams = {
  tokenIn: string,
  tokenOut: string,
  rpcURL: string,
}
type ActSelectPriceParams = {
  side: "buy" | "sell",
  price: number
}
const initialState: InitialStateType = {
  order: {
    sell: [],
    buy: []
  },
  side: true,//true -> buy, false -> sell
  priceSelected: {
    buy: {
      price: 0,
      trigger: false
    },
    sell: {
      price: 0,
      trigger: false
    }
  },
  pair: {

  },
  decimals: {
    form: 18,
    orderbook: 0
  }
}
export const actAsyncGetDecimals = createAsyncThunk("orderBook/decimals", async ({ dappId, tokenIn, tokenOut }: GetMinPriceParams, { rejectWithValue }) => {
  console.log("RUNXXX")
  try {
    const price = await orderBookAPI.getMinPrice({
      dappId,
      tokenIn: tokenIn?.toLowerCase(),
      tokenOut: tokenOut?.toLowerCase()
    })
    const log = Math.floor(Math.round(100 * Math.log(price.minPrice) / Math.log(10)) / 100);
    if (log <= 1 && log >= -15) {
      return 3 - log;
    }
    else if (log > 1) {
      return 2;
    }
    else {
      return 18;
    }
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncGetOrderBook = createAsyncThunk("orderBook/open", async ({ dappId, tokenIn, tokenOut, decimal, column, sort, side }: GetOrderBookParams) => {
  const orders = await orderBookAPI.gets({
    dappId,
    tokenIn: tokenIn?.toLowerCase(),
    tokenOut: tokenOut?.toLowerCase(),
    decimal,
    column,
    sort,
    side
  })
  return {
    side,
    orders
  };
})
export const actAsyncGetPair = createAsyncThunk("orderBook/pair", async ({ tokenIn, tokenOut, rpcURL }: GetPairParams) => {
  const tokenInName = await ERC20API({
    rpc: rpcURL,
    token: tokenIn,
  }).getName();
  const tokenInSymbol = await ERC20API({
    rpc: rpcURL,
    token: tokenIn,
  }).getSymbol();
  const tokenInDecimals = await ERC20API({
    rpc: rpcURL,
    token: tokenIn,
  }).getDecimals();
  const tokenOutName = await ERC20API({
    rpc: rpcURL,
    token: tokenOut,
  }).getName();
  const tokenOutSymbol = await ERC20API({
    rpc: rpcURL,
    token: tokenOut,
  }).getSymbol();
  const tokenOutDecimals = await ERC20API({
    rpc: rpcURL,
    token: tokenOut,
  }).getDecimals();
  return {
    [tokenIn]: {
      contract: tokenIn,
      symbol: tokenInSymbol,
      decimals: parseInt(tokenInDecimals),
      name: tokenInName
    },
    [tokenOut]: {
      contract: tokenOut,
      symbol: tokenOutSymbol,
      decimals: parseInt(tokenOutDecimals),
      name: tokenOutName
    }
  }
})
const orderBookSlice = createSlice({
  name: "orderBook",
  initialState: initialState,
  reducers: {
    actSwitchSide: (state, { payload }) => {
      state.side = payload;
    },
    actSelectPrice: (state, { payload: { price, side } }: { payload: ActSelectPriceParams }) => {
      state.priceSelected[side] = {
        price,
        trigger: !state.priceSelected[side].trigger
      };
    }
  },
  extraReducers(builder) {
    builder.addCase(actAsyncGetOrderBook.fulfilled, (state, { payload: { side, orders } }) => {
      state.order[side] = orders;
    })
    builder.addCase(actAsyncGetPair.fulfilled, (state, { payload }) => {
      state.pair = payload;
    })
    builder.addCase(actAsyncGetDecimals.fulfilled, (state, { payload }) => {
      state.decimals = {
        form: payload,
        orderbook: payload
      };
    })
  },
})
export default orderBookSlice.reducer;
export const { actSwitchSide, actSelectPrice } = orderBookSlice.actions;