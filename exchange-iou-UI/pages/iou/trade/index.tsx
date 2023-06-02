import { useRouter } from "next/router";
import React from "react";
import TradeInfo from "../../../components/TradeInfo";
import TradeChart from "../../../components/TradeChart";
import TradeForm from "../../../components/TradeForm";
import OrderBook from "../../../components/OrderBook";
import UserOrderBook from "../../../components/UserOrderBook";

type Props = {};

export default function TradePage({}: Props) {
  return (
    <div>
      <TradeInfo></TradeInfo>
      <div className="row">
        <div className="col-xxl-9">
          <TradeChart></TradeChart>
          <UserOrderBook></UserOrderBook>
        </div>
        <div className="col-xxl-3">
          <OrderBook></OrderBook>
          <TradeForm></TradeForm>
        </div>
      </div>
    </div>
  );
}
