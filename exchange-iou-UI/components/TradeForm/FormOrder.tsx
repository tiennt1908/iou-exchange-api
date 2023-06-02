import React, { ReactNode, useEffect, useState } from "react";
import Button from "../General/Button";
import { useRouter } from "next/router";
import { regexCustom, validate } from "../../helpers/validate";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { actAsyncApprove, actAsyncBuy } from "../../store/userSlice";
import orderBookAPI from "../../services/orderBook";
import Input from "../General/Input";

type Props = {
  priceSymbol: string;
  amountSymbol: string;
  totalSymbol: string;
  side: "buy" | "sell";
  token: string;
};
type ButtonApproveType = {
  children: JSX.Element;
  allowance: number;
  value: number;
  approve: Function;
  loading: boolean;
  text: string;
};

export function ButtonApprove({
  children,
  allowance,
  value,
  approve,
  loading,
  text,
}: ButtonApproveType): JSX.Element {
  if (allowance >= value) {
    return children;
  }
  return (
    <Button theme="dark" type="button" className="w-100" loading={loading} onClick={approve}>
      {text}
    </Button>
  );
}
export default function FormOrder({ priceSymbol, amountSymbol, totalSymbol, side, token }: Props) {
  const { dappId, tokenIn, tokenOut } = useRouter().query;

  const dispatch = useDispatch<AppDispatch>();
  const dapp = useSelector((state: RootState) => state.dapp);
  const chain = useSelector((state: RootState) => state.chain);
  const user = useSelector((state: RootState) => state.user);
  const { pair, priceSelected, order, decimals } = useSelector(
    (state: RootState) => state.orderbook
  );

  const balance = user.balance[chain.using]?.[token]?.amount;
  const initialForm = {
    amount: "",
    price: "",
    total: "",
  };
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const reverseSide: Props["side"] = side === "buy" ? "sell" : "buy";

  useEffect(() => {
    setForm(initialForm);
  }, [dappId, tokenIn, tokenOut]);

  useEffect(() => {
    const price = priceSelected[reverseSide].price;
    const orders = order[reverseSide];
    const filterOrder = orders.filter((e) =>
      side === "buy" ? e.price <= price : e.price >= price
    );
    const sumAmount = filterOrder.reduce((total, obj) => {
      return total + obj.tokenInAmount;
    }, 0);
    const total = sumAmount * price;

    if (validate.address(token) && price > 0 && balance) {
      if (side === "buy") {
        const amount = (balance >= total ? sumAmount : balance / price).toString();
        const totalPay = (balance >= total ? total : balance)?.toString();
        setForm({
          amount,
          price: price.toString(),
          total: totalPay,
        });
      } else {
        const amount = (balance >= sumAmount ? sumAmount : balance).toString();
        const totalPay = (balance >= sumAmount ? total : balance * price).toString();
        setForm({
          amount,
          price: price.toString(),
          total: totalPay,
        });
      }
    }
  }, [priceSelected[reverseSide].trigger]);

  const handleAmount = (value: string) => {
    let total = (parseFloat(form.price) * parseFloat(value)).toString();
    if (!value || !form.price) {
      total = "";
    }
    setForm({
      ...form,
      amount: value,
      total: regexCustom.cutFloatNumber(parseFloat(total).toFixed(6)),
    });
  };
  const handleTotal = (value: string) => {
    let amount = (parseFloat(value) / parseFloat(form.price)).toString();
    if (!form.price || !value) {
      amount = "";
    }
    setForm({
      ...form,
      amount: regexCustom.cutFloatNumber(parseFloat(amount).toFixed(6)),
      total: value,
    });
  };
  const handlePrice = (value: string) => {
    const price = regexCustom.limitDecimal(value, decimals.form) as string;
    let total = (parseFloat(value) * parseFloat(form.amount)).toString();
    if (!form.amount || !value) {
      total = "";
    }
    setForm({
      ...form,
      price,
      total,
    });
  };
  const handleApprove = ({ token, value }: { token: string; value: number }) => {
    if (!loading) {
      setLoading(true);
      dispatch(actAsyncApprove({ token, value })).then(() => {
        setLoading(false);
      });
    }
  };
  const handleBuy = async () => {
    if (!loading) {
      setLoading(true);
      const ordersMath = await orderBookAPI.getMathOrders({
        price: parseFloat(form.price),
        dappId: parseInt(dappId as string),
        tokenIn: tokenIn as string,
        tokenOut: tokenOut as string,
        paymentAmount: parseFloat(form.total),
      });
      dispatch(
        actAsyncBuy({
          price: parseFloat(form.price),
          orders: ordersMath,
          tokenOutAmount: parseFloat(form.total),
          tokenIn: tokenIn as string,
          tokenOut: tokenOut as string,
        })
      ).then(() => {
        setLoading(false);
      });
    }
  };
  const handleSell = async () => {
    if (!loading) {
      setLoading(true);
      const ordersMath = await orderBookAPI.getMathOrders({
        price: 1 / parseFloat(form.price),
        dappId: parseInt(dappId as string),
        tokenIn: tokenOut as string,
        tokenOut: tokenIn as string,
        paymentAmount: parseFloat(form.amount),
      });
      dispatch(
        actAsyncBuy({
          price: 1 / parseFloat(form.price),
          orders: ordersMath,
          tokenOutAmount: parseFloat(form.amount),
          tokenIn: tokenOut as string,
          tokenOut: tokenIn as string,
        })
      ).then(() => {
        setLoading(false);
      });
    }
  };
  const allowanceToken = user.allowance[chain.using]?.[dapp.using.contract]?.[token]?.amount;
  return (
    <div className="p-3">
      <div>
        <div className="input-group mb-3">
          <label className="input-group-text">Price</label>
          <input
            type="text"
            className="form-control"
            value={form?.price}
            onChange={(e) => {
              handlePrice(e.target.value);
            }}
          />
          <label className="input-group-text">{priceSymbol}</label>
        </div>
        <div className="input-group mb-3">
          <label className="input-group-text">Amount</label>
          <input
            type="text"
            className="form-control"
            value={form?.amount}
            onChange={(e) => {
              handleAmount(e.target.value);
            }}
          />
          <label className="input-group-text">{amountSymbol}</label>
        </div>
        <div className="input-group mb-0">
          <label className="input-group-text">Total</label>
          <input
            type="text"
            className="form-control"
            value={form?.total}
            onChange={(e) => {
              handleTotal(e.target.value);
            }}
          />
          <label className="input-group-text">{totalSymbol}</label>
        </div>
      </div>
      <div className="mt-3 pt-2">
        <div className="d-flex">
          <div className="flex-grow-1">
            <p className="fs-13 mb-0">
              Transaction Fees
              <span className="text-muted ms-1 fs-11">(0.00%)</span>
            </p>
          </div>
          <div className="flex-shrink-0">
            <h6 className="mb-0">$0.00</h6>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-2">
        {side === "buy" && (
          <ButtonApprove
            allowance={allowanceToken}
            value={parseFloat(form.total || "0")}
            approve={() => {
              handleApprove({ token, value: parseFloat(form.total) });
            }}
            loading={loading}
            text={`Approve ${totalSymbol}`}
          >
            <Button
              type="button"
              theme="success"
              className="w-100"
              loading={loading}
              onClick={handleBuy}
            >
              Buy {amountSymbol}
            </Button>
          </ButtonApprove>
        )}
        {side === "sell" && (
          <ButtonApprove
            allowance={allowanceToken}
            value={parseFloat(form.amount || "0")}
            approve={() => {
              handleApprove({ token, value: parseFloat(form.amount) });
            }}
            loading={loading}
            text={`Approve ${amountSymbol}`}
          >
            <Button
              type="button"
              theme="danger"
              className="w-100"
              loading={loading}
              onClick={handleSell}
            >
              Sell {amountSymbol}
            </Button>
          </ButtonApprove>
        )}
        {/* {side &&
          (allowanceTokenOut >= (parseFloat(form.total) || 0) ? (
            <Button
              type="button"
              theme="success"
              className="w-100"
              onClick={handleBuy}
              loading={loadingRequest}
            >
              Buy {tokenInSymbol}
            </Button>
          ) : (
            <Button
              theme="dark"
              type="button"
              className="w-100"
              loading={loadingRequest}
              onClick={() => {
                handleApprove({ token: tokenOut as string, value: parseFloat(form.total) });
              }}
            >
              Approve {tokenOutSymbol}
            </Button>
          ))}
        {!side &&
          (allowanceTokenIn >= (parseFloat(form.amount) || 0) ? (
            <Button
              type="button"
              theme="danger"
              className="w-100"
              onClick={handleSell}
              loading={loadingRequest}
            >
              Sell {tokenInSymbol}
            </Button>
          ) : (
            <Button
              theme="dark"
              type="button"
              className="w-100"
              loading={loadingRequest}
              onClick={() => {
                handleApprove({ token: tokenIn as string, value: parseFloat(form.amount) });
              }}
            >
              Approve {tokenInSymbol}
            </Button>
          ))} */}
      </div>
    </div>
  );
}
