import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderBook from "../../../../components/OrderBook";
import TradeChart from "../../../../components/TradeChart";
import TradeForm from "../../../../components/TradeForm";
import { validate } from "../../../../helpers/validate";
import { AppDispatch, RootState } from "../../../../store";
import { actAsyncGetDappById } from "../../../../store/dappSlice";
import { actAsyncGetDecimals, actAsyncGetPair } from "../../../../store/orderBookSlice";
import {
  actAsyncGetAllowance,
  actAsyncGetBalance,
  actAsyncGetMyOrders,
} from "../../../../store/userSlice";
import UserOrderBook from "../../../../components/UserOrderBook";

type Props = {};

export default function ExchangePage({}: Props) {
  const { dappId, tokenIn, tokenOut } = useRouter().query;
  const chain = useSelector((e: RootState) => e.chain);
  const user = useSelector((e: RootState) => e.user);
  const dapp = useSelector((e: RootState) => e.dapp);
  const orderbook = useSelector((e: RootState) => e.orderbook);
  const orbTokenIn = orderbook.pair[tokenIn as string];
  const orbTokenOut = orderbook.pair[tokenOut as string];
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(actAsyncGetDappById({ dappId: parseInt(dappId as string) || 0 }));
    const checkChange = setInterval(() => {
      dispatch(actAsyncGetDappById({ dappId: parseInt(dappId as string) || 0 }));
    }, dapp.checkCycle);
    return () => {
      clearInterval(checkChange);
    };
  }, [dappId]);

  useEffect(() => {
    if (dapp.using.id > 0 && validate.address(tokenIn) && validate.address(tokenOut)) {
      dispatch(
        actAsyncGetPair({
          tokenIn: tokenIn as string,
          tokenOut: tokenOut as string,
          rpcURL: dapp.using.rpcURL,
        })
      );
    }
  }, [dapp.using.id]);

  useEffect(() => {
    if (validate.address(orbTokenIn?.contract) && validate.address(orbTokenOut?.contract)) {
      if (validate.address(user.address)) {
        dispatch(
          actAsyncGetBalance({
            chainId: chain.using,
            rpcURL: dapp.using.rpcURL,
            tokenAddress: orbTokenIn?.contract,
            tokenDecimal: orbTokenIn?.decimals,
            userAddress: user.address,
          })
        );
        dispatch(
          actAsyncGetBalance({
            chainId: chain.using,
            rpcURL: dapp.using.rpcURL,
            tokenAddress: orbTokenOut?.contract,
            tokenDecimal: orbTokenOut?.decimals,
            userAddress: user.address,
          })
        );
        dispatch(
          actAsyncGetAllowance({
            chainId: chain.using,
            rpcURL: dapp.using.rpcURL,
            contractApprove: dapp.using.contract,
            tokenAddress: orbTokenIn?.contract,
            tokenDecimal: orbTokenIn?.decimals,
            userAddress: user.address,
          })
        );
        dispatch(
          actAsyncGetAllowance({
            chainId: chain.using,
            rpcURL: dapp.using.rpcURL,
            contractApprove: dapp.using.contract,
            tokenAddress: orbTokenOut?.contract,
            tokenDecimal: orbTokenOut?.decimals,
            userAddress: user.address,
          })
        );
        dispatch(
          actAsyncGetMyOrders({
            tokenIn: orbTokenIn?.contract,
            tokenOut: orbTokenOut?.contract,
            rpcURL: dapp.using.rpcURL,
            contract: dapp.using.contract,
            userAddress: user.address,
          })
        );
      }
      dispatch(
        actAsyncGetDecimals({
          dappId: dapp.using.id,
          tokenIn: orbTokenIn?.contract,
          tokenOut: orbTokenOut?.contract,
        })
      );
    }
  }, [orbTokenIn, orbTokenOut, user.address]);

  return (
    <div>
      {/* <TradeInfo></TradeInfo> */}
      <div className="row">
        <div className="col-xxl-12 row">
          <div className="col-xxl-3">
            <OrderBook></OrderBook>
          </div>
          <div className="col-xxl-9">
            <TradeChart></TradeChart>
            <div>
              <TradeForm></TradeForm>
            </div>
          </div>
        </div>
        <div className="col-xxl-12 mt-4">
          <UserOrderBook></UserOrderBook>
        </div>
      </div>
    </div>
  );
}
