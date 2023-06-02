import { configureStore } from '@reduxjs/toolkit'
import orderBookReducer from './orderBookSlice'
import dappReducer from './dappSlice'
import userReducer from './userSlice'
import chainReducer from './chainSlice'
import tokenReducer from './tokenSlice'
import orderHistoryReducer from './orderHistorySlice'

export const store = configureStore({
  reducer: {
    orderbook: orderBookReducer,
    dapp: dappReducer,
    user: userReducer,
    chain: chainReducer,
    token: tokenReducer,
    orderHistory: orderHistoryReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch