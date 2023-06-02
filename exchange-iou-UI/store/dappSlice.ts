import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderBookAPI, { GetOrderBookParams, OrderBookType } from "../services/orderBook";
import dappAPI, { DappType } from "../services/dapp";
import { ERC20API } from "../contractAPI/ERC20";

type InitialStateType = {
  using: DappType,
  checkCycle: number
}
type GetDappParams = {
  dappId: number,
}
const initialState: InitialStateType = {
  using: {
    id: 0,
    contract: "",
    totalEventCalled: 0,
    typeId: 0,
    chainId: 0,
    chainName: "",
    rpcURL: ""
  },
  checkCycle: 3000
}
export const actAsyncGetDappById = createAsyncThunk("dapp/get-by-id", async ({ dappId }: GetDappParams) => {
  const dapp = await dappAPI.getById({ id: dappId });
  return dapp;
})
const dappSlice = createSlice({
  name: "dapp",
  initialState: initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(actAsyncGetDappById.fulfilled, (state, { payload }) => {
      if (payload) {
        state.using = {
          ...payload,
          contract: payload?.contract?.toLowerCase()
        }
      }
    })
  },
})
export default dappSlice.reducer;
