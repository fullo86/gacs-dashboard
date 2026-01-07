"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { compactFormat } from "@/lib/format-number";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function DonutChart({ data = [], chartSize = "80%" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Cek apakah data valid atau gunakan fallback jika data tidak ada
  const safeData = Array.isArray(data)
    ? data.map((item) => ({
        name: item.name || "-",
        amount: isNaN(Number(item.amount)) ? 0 : Number(item.amount),
      }))
    : [];

  if (safeData.length === 0) return <div>No data available</div>;

  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    colors: ["#49D3A1", "#D77362", "#007BFF", "#FFC107", "#A0A0A0"],
    labels: safeData.map((d) => d.name),
    legend: {
      show: true,
      position: "bottom",
      itemMargin: { horizontal: 10, vertical: 5 },
      formatter: (label, opts) => {
        const percent = opts.w.globals.seriesPercent?.[opts.seriesIndex] || 0;
        return `${label}: ${Math.round(percent)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: chartSize,
          background: "transparent",
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
              formatter: (val) => compactFormat(Number(val) || 0),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    responsive: [
      {
        breakpoint: 1024,
        options: { chart: { width: "100%" } },
      },
      {
        breakpoint: 640,
        options: { chart: { width: 300 } },
      },
    ],
  };

  return (
    <Chart
      options={chartOptions}
      series={safeData.map((d) => d.amount)}
      type="donut"
    />
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { compactFormat } from "@/lib/format-number";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// export function DonutChart({ data = [], chartSize = "80%" }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null;

//   const safeData = Array.isArray(data)
//     ? data.map((item) => ({
//         name: item.name || "-",
//         amount: Number(item.amount) || 0,
//       }))
//     : [];

//   if (safeData.length === 0) return <div>No data available</div>;

//   const chartOptions = {
//     chart: {
//       type: "donut",
//       fontFamily: "inherit",
//     },
//     colors: ["#49D3A1", "#D77362", "#007BFF", "#FFC107", "#A0A0A0"],
//     labels: safeData.map((d) => d.name),
//     legend: {
//       show: true,
//       position: "bottom",
//       itemMargin: { horizontal: 10, vertical: 5 },
//       formatter: (label, opts) => {
//         const percent = opts.w.globals.seriesPercent?.[opts.seriesIndex] || 0;
//         return `${label}: ${Math.round(percent)}%`;
//       },
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           size: chartSize,
//           background: "transparent",
//           labels: {
//             show: true,
//             value: {
//               show: true,
//               fontSize: "28px",
//               fontWeight: "bold",
//               formatter: (val) => compactFormat(Number(val) || 0),
//             },
//           },
//         },
//       },
//     },
//     dataLabels: { enabled: false },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: { chart: { width: "100%" } },
//       },
//       {
//         breakpoint: 640,
//         options: { chart: { width: 300 } },
//       },
//     ],
//   };

//   return (
//     <Chart
//       options={chartOptions}
//       series={safeData.map((d) => d.amount)}
//       type="donut"
//     />
//   );
// }
