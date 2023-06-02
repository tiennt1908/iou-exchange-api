import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { format } from "../../helpers/format";
import { useRouter } from "next/router";
import { regexCustom } from "../../helpers/validate";

type Props = {};

export default function ChartHeader({}: Props) {
  const { openPrice, lowPrice, highPrice, currentPrice, volume } = useSelector(
    (state: RootState) => state.orderHistory.priceInfo
  );
  const { pair, decimals } = useSelector((state: RootState) => state.orderbook);
  const { dappId, tokenIn, tokenOut } = useRouter().query;
  const tokenOutSymbol = pair[tokenOut as string]?.symbol;
  const tokenInSymbol = pair[tokenIn as string]?.symbol;
  const tokenInName = pair[tokenIn as string]?.name;

  const distance = currentPrice - openPrice;
  const percent = (distance / openPrice) * 100;
  return (
    <div className="card-body p-0">
      <div className="bg-soft-light border-top-dashed border border-start-0 border-end-0 border-bottom-dashed py-3 px-4">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="d-flex flex-wrap gap-4 align-items-center">
              <div>
                <h3 className="fs-19" title={currentPrice.toString()}>
                  {regexCustom.limitDecimal(currentPrice.toFixed(18), decimals.form)}{" "}
                  {tokenOutSymbol}
                </h3>
                <p className="text-muted text-uppercase fw-medium mb-0">
                  {tokenInName} ({tokenInSymbol}){" "}
                  <small className={`badge badge-soft-${percent >= 0 ? "success" : "danger"}`}>
                    <i
                      className={`ri-arrow-right-${percent >= 0 ? "up" : "down"}-line align-bottom`}
                    />{" "}
                    {percent.toFixed(2)}%
                  </small>
                </p>
              </div>
            </div>
          </div>
          {/* end col */}
          <div className="col-6">
            <div className="d-flex">
              <div className="d-flex justify-content-end text-end flex-wrap gap-4 ms-auto">
                <div className="pe-3">
                  <h6 className="mb-2 text-muted">High</h6>
                  <h5 className="text-success mb-0" title={highPrice.toString()}>
                    {regexCustom.limitDecimal(highPrice.toFixed(18), decimals.form)}{" "}
                    {tokenOutSymbol}
                  </h5>
                </div>
                <div className="pe-3">
                  <h6 className="mb-2 text-muted">Low</h6>
                  <h5 className="text-danger mb-0" title={lowPrice.toString()}>
                    {regexCustom.limitDecimal(lowPrice.toFixed(18), decimals.form)} {tokenOutSymbol}
                  </h5>
                </div>
                <div>
                  <h6 className="mb-2 text-muted">Market Volume</h6>
                  <h5 className="text-danger mb-0">
                    {Math.ceil(volume * 100) / 100} {tokenOutSymbol}
                  </h5>
                </div>
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
    </div>
  );
}
