import React, { useState } from "react";
import { OrderType, actAsyncCancelOrder } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import TokenLogo from "../General/TokenLogo";
import Button from "../General/Button";

type Props = {
  order: OrderType;
};

export default function MyOrder({ order }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const pair = useSelector((e: RootState) => e.orderbook.pair);
  const [loading, setLoading] = useState(false);
  const {
    createAt,
    id,
    maker,
    status,
    tokenIn,
    tokenInAmount,
    tokenInAmountSold,
    tokenOut,
    tokenOutAmount,
    side,
  } = order;
  const tokenInSymbol = side ? pair[tokenOut]?.symbol : pair[tokenIn]?.symbol;
  const tokenOutSymbol = side ? pair[tokenIn]?.symbol : pair[tokenOut]?.symbol;
  const formatDate = new Date(createAt * 1000);
  const orderDate =
    formatDate.getFullYear() +
    "-" +
    formatDate.getMonth() +
    "-" +
    formatDate.getDate() +
    " " +
    formatDate.getHours() +
    ":" +
    formatDate.getMinutes() +
    ":" +
    formatDate.getSeconds();
  const price = side ? tokenInAmount / tokenOutAmount : tokenOutAmount / tokenInAmount;
  const filled = (tokenInAmountSold / tokenInAmount) * 100;
  const amount = side ? tokenOutAmount : tokenInAmount;
  const total = side ? tokenInAmount : tokenOutAmount;

  const handleCancel = (orderId: number) => {
    if (!loading) {
      setLoading(true);
      dispatch(actAsyncCancelOrder({ orderIds: [orderId] })).finally(() => {
        setLoading(false);
      });
    }
  };
  return (
    <tr className="order-sell-row">
      <td>
        {tokenInSymbol}/{tokenOutSymbol}
      </td>
      <td className="quantity_value">{orderDate}</td>
      <td className="avg_price">
        {side ? (
          <span className="text-success">Buy</span>
        ) : (
          <span className="text-danger">Sell</span>
        )}
      </td>
      <td className="current_value">{price.toFixed(4)}</td>
      <td className="returns">{amount}</td>
      <td className="returns_per">
        <h6 className="text-success fs-13 mb-0">{(Math.floor(filled * 100) / 100).toFixed(2)}%</h6>
      </td>
      <td className="returns text-end">
        {total} {tokenOutSymbol}
      </td>
      <td className="d-flex justify-content-end">
        <Button
          type="button"
          onClick={() => {
            handleCancel(id);
          }}
          theme="light"
          loading={loading}
        >
          Cancel
        </Button>
      </td>
    </tr>
  );
}
