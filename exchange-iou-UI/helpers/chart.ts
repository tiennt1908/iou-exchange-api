import { GetChartResponse } from "../services/orderHistory"

type ConfigChart<T> = {
  title: string,
  label: string,
  data: T[],
  decimal: number
}
export const chart = {
  config: <T>({ title, label, data, decimal }: ConfigChart<T>) => {
    return {
      series: [
        {
          name: label,
          data: data || [],
        },
      ],
      options: {
        colors: ['#00E396'],
        chart: {
          type: "area",
          height: 350,
          zoom: {
            enabled: true,
          },
          toolbar: {
            autoSelected: "zoom",
            tools: {
              download: false,
            },
          },
        },
        tooltip: {
          x: {
            show: true,
            format: "yyyy MMM dd HH:mm",
            formatter: undefined,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          colors: ["#16c784"],
          curve: "straight",
        },
        title: {
          text: title,
          align: "left",
        },
        subtitle: {
          text: "",
          align: "left",
        },
        xaxis: {
          type: "datetime"
        },
        yaxis: {
          opposite: true,
          decimalsInFloat: decimal,
        },
        legend: {
          horizontalAlign: "left",
        },
      },
      selection: "one_year",
    }
  }
}