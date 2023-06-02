import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "../../helpers/format";
import { regexCustom, validate } from "../../helpers/validate";
import orderBookAPI from "../../services/orderBook";
import { AppDispatch, RootState } from "../../store";
import { actSwitchSide } from "../../store/orderBookSlice";
import { actAsyncApprove, actAsyncBuy } from "../../store/userSlice";
import Button from "../General/Button";
import Header from "./Header";
import Balance from "./Balance";
import FormOrder from "./FormOrder";

type Props = {};

export default function TradeForm({}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { dappId, tokenIn, tokenOut } = useRouter().query;

  const chain = useSelector((state: RootState) => state.chain);
  const user = useSelector((state: RootState) => state.user);
  const dapp = useSelector((state: RootState) => state.dapp);
  const currentPrice = useSelector((state: RootState) => state.orderHistory.priceInfo.currentPrice);
  const { pair } = useSelector((state: RootState) => state.orderbook);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const balanceTokenIn = user.balance[chain.using]?.[tokenIn as string]?.amount;
  const balanceTokenOut = user.balance[chain.using]?.[tokenOut as string]?.amount;
  const tokenOutString = tokenOut as string;
  const tokenInString = tokenIn as string;
  const tokenInSymbol = pair[tokenIn as string]?.symbol;
  const tokenOutSymbol = pair[tokenOut as string]?.symbol;

  return (
    <div
      className="card card-height-100 py-2 mb-0"
      style={{
        height: 375.7,
      }}
    >
      {/* <Header></Header> */}
      <div className="card-body p-0">
        <div className="tab-content text-muted">
          <div className="row">
            <div className="col-xxl-6">
              <Balance token={tokenOutString} />
              <FormOrder
                side="buy"
                token={tokenOutString}
                priceSymbol={tokenOutSymbol}
                amountSymbol={tokenInSymbol}
                totalSymbol={tokenOutSymbol}
              />
            </div>
            <div className="col-xxl-6">
              <Balance token={tokenInString} />
              <FormOrder
                side="sell"
                token={tokenInString}
                priceSymbol={tokenOutSymbol}
                amountSymbol={tokenInSymbol}
                totalSymbol={tokenOutSymbol}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
