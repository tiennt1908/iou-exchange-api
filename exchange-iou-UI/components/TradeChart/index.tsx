import React, { useEffect, useState } from "react";
import orderHistoryAPI, { GetChartResponse } from "../../services/orderHistory";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { validate } from "../../helpers/validate";
import { chart } from "../../helpers/chart";
import { format } from "../../helpers/format";
import ChartHeader from "./ChartHeader";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TradeChart() {
  const { dappId, tokenIn, tokenOut } = useRouter().query;
  const orderbook = useSelector((e: RootState) => e.orderbook);
  const chartData = useSelector((state: RootState) => state.orderHistory.chart.list);
  const orbTokenIn = orderbook.pair[tokenIn as string];
  const orbTokenOut = orderbook.pair[tokenOut as string];

  const dapp = useSelector((e: RootState) => e.dapp);
  const [data, setData]: any = useState(null);

  useEffect(() => {
    if (
      validate.address(orbTokenIn?.contract) &&
      validate.address(orbTokenOut?.contract) &&
      dapp.using.id > 0
    ) {
      const decimal = format.getDecimalNumber(chartData[chartData.length - 1]?.[1] || 0);
      const config = chart.config<GetChartResponse>({
        title: orbTokenIn.symbol + "/" + orbTokenOut.symbol,
        data: chartData,
        label: `Price(${orbTokenOut.symbol})`,
        decimal: decimal > 2 ? 0 : 3 - decimal,
      });
      setData(config);
    }
  }, [chartData, orbTokenIn, orbTokenOut]);

  return (
    <div className="card">
      <div className="card-header border-0 align-items-center d-flex">
        <h4 className="card-title mb-0 flex-grow-1">Market Graph</h4>
        <div>
          <button type="button" className="btn btn-soft-secondary btn-sm me-1">
            1H
          </button>
          <button type="button" className="btn btn-soft-secondary btn-sm me-1">
            7D
          </button>
          <button type="button" className="btn btn-soft-secondary btn-sm me-1">
            1M
          </button>
          <button type="button" className="btn btn-soft-secondary btn-sm me-1">
            1Y
          </button>
          <button type="button" className="btn btn-soft-primary btn-sm">
            ALL
          </button>
        </div>
      </div>
      {/* end card header */}
      <ChartHeader />
      {/* end cardbody */}
      <div className="card-body p-0 pb-3">
        <div className="apex-charts">
          <div style={{ height: 342 }}>
            {typeof window !== "undefined" && data && (
              <ReactApexChart
                type="area"
                options={data?.options as ApexOptions}
                series={data?.series}
                height={350}
              ></ReactApexChart>
            )}
          </div>
        </div>
      </div>
      {/* end cardbody */}
    </div>
  );
}
