import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderBookAPI, { GetOrderBookParams, MathOrderType, OrderBookType } from "../services/orderBook";
import dappAPI, { DappType } from "../services/dapp";
import { ERC20API } from "../contractAPI/ERC20";
import { type } from "os";
import { BuyParams, CancelParams, ExchangeAPI } from "../contractAPI/Exchange";
import Web3 from "web3";
import { metamask } from "../services/metamask";
import { RootState } from ".";

export type OrderType = {
  createAt: number,
  id: number,
  maker: string,
  status: number,
  tokenIn: string,
  tokenInAmount: number,
  tokenInAmountSold: number,
  tokenOut: string,
  tokenOutAmount: number,
  side: boolean
}
type InitialStateType = {
  balance: {
    [key: number]: {
      [key: string]: {
        amount: number
      }
    }
  },
  address: string,
  allowance: {
    [key: number]: {
      [key: string]: {
        [key: string]: {
          amount: number
        }
      }
    }
  },
  order: {
    emptyOrderIds: {
      [key: string]: number[]
    }
    list: OrderType[]
  }
}
//chain id -> contract -> tokencontract->amount
type GetBalanceParams = {
  rpcURL: string,
  chainId: number,
  tokenAddress: string,
  tokenDecimal: number,
  userAddress: string
}
type GetAllowanceParams = {
  rpcURL: string,
  chainId: number,
  contractApprove: string,
  tokenDecimal: number,
  tokenAddress: string,
  userAddress: string
}
type GetMyOrdersParams = {
  rpcURL: string,
  contract: string,
  userAddress: string,
  tokenIn: string,
  tokenOut: string
}
type ActionBuyParams = {
  price: number,
  orders: MathOrderType[],
  tokenIn: string,
  tokenOut: string
  tokenOutAmount: number
}
type ActionSetOrderParams = {
  tokenIn: string,
  tokenOut: string,
  tokenInAmount: number,
  price: number
}
type ApproveParams = {
  token: string,
  value: number
}
const initialState: InitialStateType = {
  balance: {
  },
  address: "",
  allowance: {},
  order: {
    emptyOrderIds: {

    },
    list: []
  }
}
export const actAsyncReloadUserExchange = createAsyncThunk("user/exchange-reload", async (empty: boolean, { getState, rejectWithValue, dispatch }) => {
  try {
    const state = getState() as RootState;
    const { rpcURL, contract } = state.dapp.using;
    const user = state.user;
    const orderbook = state.orderbook.pair;
    const chain = state.chain;
    const pairKeys = Object.keys(orderbook);
    const tokenIn = orderbook[pairKeys[0]].contract;
    const tokenOut = orderbook[pairKeys[1]].contract;

    dispatch(
      actAsyncGetMyOrders({
        tokenIn: orderbook[tokenIn].contract,
        tokenOut: orderbook[tokenOut].contract,
        rpcURL: rpcURL,
        contract: contract,
        userAddress: user.address,
      })
    );
    dispatch(
      actAsyncGetBalance({
        chainId: chain.using,
        rpcURL: rpcURL,
        tokenAddress: orderbook[tokenIn].contract,
        tokenDecimal: orderbook[tokenIn].decimals,
        userAddress: user.address,
      })
    );
    dispatch(
      actAsyncGetBalance({
        chainId: chain.using,
        rpcURL: rpcURL,
        tokenAddress: orderbook[tokenOut].contract,
        tokenDecimal: orderbook[tokenOut].decimals,
        userAddress: user.address,
      })
    );
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncGetMyOrders = createAsyncThunk("user/get-my-orders", async ({ tokenIn, tokenOut, rpcURL, contract, userAddress }: GetMyOrdersParams, { getState, rejectWithValue }) => {
  try {
    const { orderbook: { pair } }: any = getState();
    const tokenInDecimal = pair[tokenIn].decimals;
    const tokenOutDecimal = pair[tokenOut].decimals;

    const exchangeAPI = ExchangeAPI({ rpc: rpcURL, address: contract });
    const responseOrderSellIds = await exchangeAPI.getMyOpenOrderIds({ user: userAddress, tokenIn, tokenOut });
    const orderSellIds = [];
    const emptyOrderSellIds = [];
    const orderSell = [];
    let i = 0;
    for (i = 0; i < 50; i++) {
      const orderId = parseInt(responseOrderSellIds[i]);
      orderSellIds.push(orderId)
    }
    const responseOrderSells = await exchangeAPI.getOrderByIds({ orderIds: orderSellIds });
    for (i = 0; i < 50; i++) {
      const order = responseOrderSells[i];
      const orderStatus = parseInt(order.status);
      if (orderStatus === 1) {
        orderSell.push({
          createAt: parseInt(order.createAt),
          id: parseInt(order.id),
          maker: order.maker?.toLowerCase(),
          status: orderStatus,
          tokenIn: order.tokenIn?.toLowerCase(),
          tokenInAmount: order.tokenInAmount / 10 ** tokenInDecimal,
          tokenInAmountSold: order.tokenInAmountSold / 10 ** tokenInDecimal,
          tokenOut: order.tokenOut?.toLowerCase(),
          tokenOutAmount: order.tokenOutAmount / 10 ** tokenOutDecimal,
          side: false
        })
      }
      else {
        emptyOrderSellIds.push(i + 1);
      }
    }

    const responseOrderBuyIds = await exchangeAPI.getMyOpenOrderIds({ user: userAddress, tokenIn: tokenOut, tokenOut: tokenIn });
    const orderBuyIds = [];
    const emptyOrderBuyIds = [];
    const orderBuy = [];
    for (i = 0; i < 50; i++) {
      const orderId = parseInt(responseOrderBuyIds[i]);
      orderBuyIds.push(orderId)
    }
    const responseOrderBuys = await exchangeAPI.getOrderByIds({ orderIds: orderBuyIds });
    for (i = 0; i < 50; i++) {
      const order = responseOrderBuys[i];
      const orderStatus = parseInt(order.status);
      if (orderStatus === 1) {
        orderBuy.push({
          createAt: parseInt(order.createAt),
          id: parseInt(order.id),
          maker: order.maker?.toLowerCase(),
          status: orderStatus,
          tokenIn: order.tokenIn?.toLowerCase(),
          tokenInAmount: order.tokenInAmount / 10 ** tokenInDecimal,
          tokenInAmountSold: order.tokenInAmountSold / 10 ** tokenInDecimal,
          tokenOut: order.tokenOut?.toLowerCase(),
          tokenOutAmount: order.tokenOutAmount / 10 ** tokenOutDecimal,
          side: true
        })
      }
      else {
        emptyOrderBuyIds.push(i + 1);
      }
    }

    const orders = [...orderSell, ...orderBuy]
    console.log(orders, "order")

    const sortOrders = orders.sort((a, b) => b.createAt - a.createAt);
    return {
      emptyOrderIds: {
        [tokenIn]: emptyOrderSellIds,
        [tokenOut]: emptyOrderBuyIds
      },
      list: sortOrders
    }
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncGetBalance = createAsyncThunk("user/get-balance", async ({ chainId, rpcURL, tokenAddress, tokenDecimal, userAddress }: GetBalanceParams, { rejectWithValue }) => {
  try {
    const tokenBalance = parseInt(await ERC20API({ rpc: rpcURL, token: tokenAddress }).getBalanceOf(userAddress));
    return {
      chainId,
      tokenAddress: tokenAddress.toLowerCase(),
      balance: tokenBalance / 10 ** tokenDecimal
    };
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncGetAllowance = createAsyncThunk("user/get-allowance", async ({ chainId, rpcURL, contractApprove, tokenAddress, tokenDecimal, userAddress }: GetAllowanceParams, { getState, rejectWithValue }) => {
  try {
    const totalApprove = parseInt(await ERC20API({ rpc: rpcURL, token: tokenAddress }).getAllowance(userAddress, contractApprove));
    return {
      chainId,
      tokenAddress: tokenAddress.toLowerCase(),
      contractApprove: contractApprove.toLowerCase(),
      amountApprove: totalApprove / 10 ** tokenDecimal
    };
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncConnectWallet = createAsyncThunk("user/connect", async () => {
  const account = await window?.ethereum
    ?.request({
      method: "eth_requestAccounts",
    })
    .then((res: any) => {
      return res[0];
    })
    .catch((err: any) => {
      return "";
    });
  return account;
})
export const actAsyncBuy = createAsyncThunk("user/buy", async ({ orders, price, tokenOutAmount, tokenIn, tokenOut }: ActionBuyParams, { getState, dispatch }) => {
  try {
    const state = getState() as RootState;
    const { rpcURL, contract, chainId } = state.dapp.using;
    const user = state.user;
    const orderbook = state.orderbook.pair;

    let balance = tokenOutAmount;
    const tokenInDecimal = orderbook[tokenIn].decimals;
    let i = 0;
    const length = orders.length;
    const orderIds: number[] = [];
    const amounts: string[] = [];

    for (i = 0; i < length; i++) {
      const order = orders[i];
      const total = order.orderAmount * order.price
      orderIds.push(order.orderIdOnchain)
      if (balance >= total) {
        amounts.push("0x" + Math.floor(order.orderAmount * 10 ** tokenInDecimal).toString(16))
      }
      else {
        amounts.push("0x" + Math.floor((balance / order.price) * 10 ** tokenInDecimal).toString(16))
      }
      balance -= total;
    }

    if (orderIds.length > 0) {
      const data = ExchangeAPI({ rpc: rpcURL, address: contract }).buyByOrderIds({ orderIds, amounts });
      const hash = await metamask.sendTransaction({ from: user.address, to: contract, data: data })
      const pendingTransaction = await metamask.getReceipt({ hash: hash, time: 3000, rpcURL: rpcURL });
      if (pendingTransaction.status) {
        const getAllowance = dispatch(actAsyncGetAllowance({
          chainId,
          rpcURL: rpcURL,
          contractApprove: contract,
          tokenAddress: tokenOut,
          tokenDecimal: orderbook[tokenOut].decimals,
          userAddress: user.address,
        }))
        const reloadData = dispatch(actAsyncReloadUserExchange(true));
        await Promise.all([getAllowance, reloadData]);
      }
    }

    if (balance > 0 && (balance / tokenOutAmount) * 100 >= 1) {
      await dispatch(actAsyncSetOrder({ tokenIn: tokenOut, tokenOut: tokenIn, tokenInAmount: balance, price }))
    }
    return true;
  }
  catch (err) {
    console.log(err, "err")
    return null;
  }
})
export const actAsyncSetOrder = createAsyncThunk("user/set-order", async ({ tokenIn, tokenOut, tokenInAmount, price }: ActionSetOrderParams, { getState, dispatch }) => {
  try {
    const state = getState() as RootState;
    const { rpcURL, contract, chainId } = state.dapp.using;
    const user = state.user;
    const orderbook = state.orderbook.pair;

    const data = ExchangeAPI({ rpc: rpcURL, address: contract }).setOrder({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      tokenInAmount: tokenInAmount * 10 ** orderbook[tokenIn].decimals,
      tokenOutAmount: (tokenInAmount / price) * 10 ** orderbook[tokenOut].decimals,
      orderIndex: user.order.emptyOrderIds[tokenIn][0]
    })
    const hash = await metamask.sendTransaction({ from: user.address, to: contract, data: data })
    const pendingTransaction = await metamask.getReceipt({ hash: hash, time: 3000, rpcURL: rpcURL });
    if (pendingTransaction.status) {
      const getAllowance = dispatch(actAsyncGetAllowance({
        chainId,
        rpcURL: rpcURL,
        contractApprove: contract,
        tokenAddress: tokenIn,
        tokenDecimal: orderbook[tokenIn].decimals,
        userAddress: user.address,
      }))
      const reloadData = dispatch(actAsyncReloadUserExchange(true));
      await Promise.all([getAllowance, reloadData]);
    }
  }
  catch (err) {
    console.log(err, "err")
    return null;
  }
})
export const actAsyncApprove = createAsyncThunk("user/approve", async ({ token, value }: ApproveParams, { getState, dispatch }) => {
  try {
    const state = getState() as RootState;
    const { rpcURL, contract, chainId } = state.dapp.using;
    const user = state.user;
    const orderbook = state.orderbook.pair;

    const data = ERC20API({ rpc: rpcURL, token: contract }).approve(contract, value * 10 ** orderbook[token].decimals);
    const hash = await metamask.sendTransaction({ from: user.address, to: token, data: data })
    const pendingTransaction = await metamask.getReceipt({ hash: hash, time: 3000, rpcURL: rpcURL });
    if (pendingTransaction.status) {
      dispatch(actAsyncGetAllowance({
        chainId,
        rpcURL: rpcURL,
        contractApprove: contract,
        tokenAddress: token,
        tokenDecimal: orderbook[token].decimals,
        userAddress: user.address,
      }))
    }
  }
  catch (err) {
    console.log(err, "err")
    return null;
  }
})
export const actAsyncCancelOrder = createAsyncThunk("user/cancel-orders", async ({ orderIds }: CancelParams, { getState, dispatch }) => {
  try {
    const state = getState() as RootState;
    const { rpcURL, contract } = state.dapp.using;
    const user = state.user;
    const data = ExchangeAPI({ rpc: rpcURL, address: contract }).cancelByOrderIds({ orderIds });
    const hash = await metamask.sendTransaction({ from: user.address, to: contract, data: data })
    const pendingTransaction = await metamask.getReceipt({ hash: hash, time: 3000, rpcURL: rpcURL });
    if (pendingTransaction.status) {
      dispatch(actAsyncReloadUserExchange(true));
    }
  }
  catch (err) {
    console.log(err, "err")
    return null;
  }
})
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(actAsyncConnectWallet.fulfilled, (state, { payload }) => {
      state.address = payload;
    })
    builder.addCase(actAsyncGetBalance.fulfilled, (state, { payload }) => {
      const { chainId, tokenAddress, balance }: any = payload;
      if (chainId && tokenAddress && balance >= 0) {
        state.balance[chainId] = { ...state.balance[chainId], [tokenAddress]: { amount: balance } };
      }
    })
    builder.addCase(actAsyncGetAllowance.fulfilled, (state, { payload }) => {
      const { chainId, tokenAddress, contractApprove, amountApprove }: any = payload;
      state.allowance[chainId] = {
        ...state.allowance[chainId],
        [contractApprove]: {
          ...state.allowance[chainId]?.[contractApprove],
          [tokenAddress]: {
            amount: amountApprove
          }
        }
      };
    })
    builder.addCase(actAsyncGetMyOrders.fulfilled, (state, { payload }) => {
      state.order = payload;
    })
  },
})
export default userSlice.reducer;
