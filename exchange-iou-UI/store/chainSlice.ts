import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chainAPI, { ChainType, GetChainParams } from "../services/chain";
import dappAPI, { DappType } from "../services/dapp";
import Web3 from "web3";

type InitialStateType = {
  mapping: {
    [key: number]: ChainType
  },
  using: number,
  defaultNetwork: number
}
const initialState: InitialStateType = {
  mapping: {

  },
  using: 0,
  defaultNetwork: 80001
}
export const actAsyncGetChains = createAsyncThunk("chain/list", async ({ index, limit }: GetChainParams) => {
  const chain = await chainAPI.gets({ index, limit });

  const count = chain?.length;
  let chainObjects: any = {};
  let i = 0;
  for (i = 0; i < count; i++) {
    const child = chain[i];
    chainObjects[child.id] = {
      ...child,
      id: child.id * 1
    };
  }
  return chainObjects;
})
export const actAsyncSwitchChain = createAsyncThunk("chain/switch", async ({ chain }: { chain: ChainType }) => {
  const { id, chainName, rpcURL, blockExplorerURL } = chain;
  try {
    await window?.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(id) }],
    });
    return id;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: Web3.utils.toHex(id),
              chainName: chainName,
              rpcUrls: [rpcURL] /* ... */,
              blockExplorerUrls: [blockExplorerURL]
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
})
const chainSlice = createSlice({
  name: "chain",
  initialState: initialState,
  reducers: {
    actSelectChain: (state, { payload }) => {
      state.using = payload;
    }
  },
  extraReducers(builder) {
    builder.addCase(actAsyncGetChains.fulfilled, (state, { payload }) => {
      state.mapping = payload;
    })
    builder.addCase(actAsyncSwitchChain.fulfilled, (state, { payload }) => {
      if (payload) {
        state.using = payload;
      }
    })
  },
})
export default chainSlice.reducer;
export const { actSelectChain } = chainSlice.actions;