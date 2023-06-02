import React from "react";
import { OrderBookType } from "../../services/orderBook";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { actSelectPrice } from "../../store/orderBookSlice";
import { regexCustom } from "../../helpers/validate";

type Props = {
  order: OrderBookType;
  side: "buy" | "sell";
  decimal: number;
};

export default function Row({ order, side, decimal }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { tokenInAmount, tokenOutAmount, price } = order;
  const selectPrice = (priceSelected: number) => {
    dispatch(actSelectPrice({ price: priceSelected, side }));
  };
  const formatNumber = (number: number) => {
    if (number === 0) {
      return 0;
    }
    const log = Math.floor(Math.round((100 * Math.log(number)) / Math.log(10)) / 100);
    if (log <= 3 && log >= -6) {
      return number.toFixed(3 - log);
    } else if (log > 3) {
      return number.toFixed(0);
    } else {
      const smallNumber = regexCustom.cutFloatNumber(number.toFixed(18));
      return (
        <span title={smallNumber}>{smallNumber.slice(0, 5) + "..." + smallNumber.slice(-4)}</span>
      );
    }
  };
  return (
    <div
      className={`row py-1 ${
        side === "sell" ? "text-danger" : "text-success"
      } order-sell-row px-3 m-0`}
      onClick={() => {
        selectPrice(price);
      }}
    >
      <div className="col-4 text-nowrap p-0">{formatNumber(price)}</div>
      <div className="col-4 text-end text-nowrap p-0">{formatNumber(tokenInAmount)}</div>
      <div className="col-4 text-end text-nowrap p-0">{formatNumber(tokenOutAmount)}</div>
    </div>
  );
}
