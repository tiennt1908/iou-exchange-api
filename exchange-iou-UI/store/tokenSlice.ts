import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dappAPI, { DappType } from "../services/dapp";
import Web3 from "web3";
import TokenOfficialAPI, { GetTokenOfficialParams, TokenOfficial } from "../services/tokenOfficial";
import TokenIouAPI, { GetTokenIouParams, TokenIou } from "../services/tokenIou";

type InitialStateType = {
  official: {
    current: number,
    total: number,
    list: TokenOfficial[]
  }
  iou: {
    current: number,
    total: number,
    list: TokenIou[]
  }
}
const initialState: InitialStateType = {
  official: {
    current: 0,
    total: 0,
    list: []
  },
  iou: {
    current: 0,
    total: 0,
    list: []
  },
}
export const actAsyncGetTokenOfficial = createAsyncThunk("token/official", async ({ index, limit, column, sort, chainId }: GetTokenOfficialParams, { rejectWithValue }) => {
  try {
    const { total, data } = await TokenOfficialAPI.gets({ index, limit, column, sort, chainId });
    return { total, data };
  }
  catch (err) {
    return rejectWithValue(err);
  }
})
export const actAsyncGetTokenIOU = createAsyncThunk("token/iou", async ({ index, limit, column, sort, tokenOfficial, chainId }: GetTokenIouParams, { rejectWithValue }) => {
  try {
    const { total, data } = await TokenIouAPI.getTokens({ index, limit, column, sort, tokenOfficial, chainId });
    return { total, data };
  }
  catch (err) {
    return rejectWithValue(err);
  }
})

const tokenSlice = createSlice({
  name: "token",
  initialState: initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder.addCase(actAsyncGetTokenOfficial.fulfilled, (state, { payload: { total, data } }) => {
      state.official.total = total;
      state.official.list = data;
    })
    builder.addCase(actAsyncGetTokenIOU.fulfilled, (state, { payload: { total, data } }) => {
      state.iou.total = total;
      state.iou.list = data;
    })
  },
})
export default tokenSlice.reducer;
