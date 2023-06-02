import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { regexCustom, validate } from "../../helpers/validate";
import { AppDispatch, RootState } from "../../store";
import { actAsyncGetOrderBook } from "../../store/orderBookSlice";
import Row from "./Row";
import { actAsyncGetChartData, actAsyncGetPriceInfo } from "../../store/orderHistorySlice";

export default function OrderBook() {
  const router = useRouter();
  const { dappId, tokenIn, tokenOut } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const { order, side, pair, decimals } = useSelector((state: RootState) => state.orderbook);
  const {
    priceInfo: { openPrice, currentPrice },
    chart: { limit, timeRange },
  } = useSelector((state: RootState) => state.orderHistory);
  const dapp = useSelector((state: RootState) => state.dapp.using);

  const forceDappId = parseInt(dappId as string) || 0;
  const forceTokenIn = tokenIn as string;
  const forceTokenOut = tokenOut as string;

  useEffect(() => {
    if (forceDappId && validate.address(forceTokenIn) && validate.address(forceTokenOut)) {
      dispatch(
        actAsyncGetOrderBook({
          dappId: forceDappId,
          tokenIn: forceTokenIn,
          tokenOut: forceTokenOut,
          decimal: decimals.orderbook,
          column: "price",
          sort: "DESC",
          side: "buy",
        })
      );
      dispatch(
        actAsyncGetOrderBook({
          dappId: forceDappId,
          tokenIn: forceTokenIn,
          tokenOut: forceTokenOut,
          decimal: decimals.orderbook,
          column: "price",
          sort: "DESC",
          side: "sell",
        })
      );
      dispatch(
        actAsyncGetChartData({
          dappId: forceDappId,
          tokenIn: forceTokenIn,
          tokenOut: forceTokenOut,
          limit,
          timeRange,
        })
      );
      dispatch(
        actAsyncGetPriceInfo({
          dappId: dapp.id,
          tokenIn: forceTokenIn,
          tokenOut: forceTokenOut,
          timeRange: 86400,
        })
      );
    }
  }, [dappId, tokenIn, tokenOut, side, decimals.orderbook, dapp.totalEventCalled]);

  const tokenInSymbol = pair[tokenIn as string]?.symbol;
  const tokenOutSymbol = pair[tokenOut as string]?.symbol;
  const distance = currentPrice - openPrice;
  const percent = (distance / openPrice) * 100;

  return (
    <div className="card h-100">
      <div className="card-header">
        <h5 className="card-title mb-0">
          {tokenInSymbol}/{tokenOutSymbol}
        </h5>
      </div>
      <div className="px-3 py-2">
        <div className="row m-0">
          <div className="col-4 text-muted text-nowrap p-0">Price({tokenOutSymbol})</div>
          <div className="col-4 text-end text-muted text-nowrap p-0">Amount({tokenInSymbol})</div>
          <div className="col-4 text-end text-muted text-nowrap p-0">Total({tokenOutSymbol})</div>
        </div>
      </div>
      <div
        style={{
          height: 361.5,
        }}
      >
        {order.sell?.map((e, k) => {
          return <Row key={k} order={e} side="sell" decimal={decimals?.orderbook}></Row>;
        })}
      </div>
      <div className="px-3 py-2 fs-5 border-top border-bottom">
        {regexCustom.limitDecimal(currentPrice.toFixed(18), decimals.form)}
        <span className={`ms-2 text-${percent >= 0 ? "success" : "danger"} fw-semibold`}>
          {percent >= 0 ? "+" : ""}
          {!isNaN(percent) ? percent.toFixed(2) : 0}%
        </span>
      </div>
      <div
        style={{
          height: 361.5,
        }}
      >
        {order.buy?.map((e, k) => {
          return <Row key={k} order={e} side="buy" decimal={decimals?.orderbook}></Row>;
        })}
      </div>
    </div>
  );
}
