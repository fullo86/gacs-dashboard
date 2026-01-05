import { cn } from "@/lib/utils";
import { DonutChart } from "@/components/Charts/DonutChart";
import { getServiceDeviceStatus } from "@/services/charts.services";

export default async function DeviceOverviewChart({
  timeFrame = "monthly",
  className,
}) {
  const data = await getServiceDeviceStatus(timeFrame);

  return (
    <div className={cn("grid ...", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Device Overview
        </h2>
      </div>

      <div className="grid place-items-center">
        <DonutChart data={data} />
      </div>
    </div>    
  );
}
