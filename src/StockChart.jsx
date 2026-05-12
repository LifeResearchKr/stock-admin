import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function StockChart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,

      layout: {
        background: {
          color: "#020617",
        },
        textColor: "#CBD5E1",
      },

      grid: {
        vertLines: {
          color: "#1E293B",
        },
        horzLines: {
          color: "#1E293B",
        },
      },
    });

    const candleSeries =
      chart.addCandlestickSeries();

    candleSeries.setData([
      {
        time: "2026-05-01",
        open: 80000,
        high: 85000,
        low: 79000,
        close: 83000,
      },
      {
        time: "2026-05-02",
        open: 83000,
        high: 86000,
        low: 82000,
        close: 84500,
      },
      {
        time: "2026-05-03",
        open: 84500,
        high: 88000,
        low: 84000,
        close: 87000,
      },
      {
        time: "2026-05-04",
        open: 87000,
        high: 89000,
        low: 85000,
        close: 86000,
      },
      {
        time: "2026-05-05",
        open: 86000,
        high: 90000,
        low: 85500,
        close: 89000,
      },
    ]);

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%" }}
    />
  );
}

export default StockChart;