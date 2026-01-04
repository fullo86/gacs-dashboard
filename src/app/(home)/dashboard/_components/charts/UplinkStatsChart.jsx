"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DonutChart } from "@/components/Charts/DonutChart";
import axios from "axios";

export default function UplinkStatsChart({ timeFrame = "monthly", className }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/uplink-stats").then((res) => setData(res.data));
  }, [timeFrame]);
  return (
    <div className={cn("grid ...", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Uplink Signal Strength
        </h2>
      </div>

      <div className="grid place-items-center">
        <DonutChart data={data?.data || []} />
      </div>
    </div>
  );
}
