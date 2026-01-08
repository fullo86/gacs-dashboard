"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { compactFormat } from "@/lib/format-number";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DonutChart({ data = [], chartSize = "80%" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const safeData = Array.isArray(data)
    ? data.map((item) => ({
        name: item.name || "-",
        amount: isNaN(Number(item.amount)) ? 0 : Number(item.amount),
      }))
    : [];

  const totalAmount = safeData.reduce((sum, d) => sum + d.amount, 0);

  if (safeData.length === 0 || totalAmount === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
        No data available
      </div>
    );
  }

  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    colors: ["#49D3A1", "#D77362", "#007BFF"],
    labels: safeData.map((d) => d.name),
    legend: {
      show: true,
      position: "bottom",
      formatter: (label, opts) => {
        const percent =
          opts.w.globals.seriesPercent?.[opts.seriesIndex] ?? 0;
        return `${label}: ${Math.round(percent)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: chartSize,
          labels: {
            show: true,
            value: {
              show: true,
              formatter: (val) => compactFormat(val),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
  };

  return (
    <Chart
      options={chartOptions}
      series={safeData.map((d) => d.amount)}
      type="donut"
    />
  );
}
