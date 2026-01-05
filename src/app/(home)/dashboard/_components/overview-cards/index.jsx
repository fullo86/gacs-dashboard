import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import { getDeviceStatus } from "../../fetch";

export async function OverviewCardsGroup() {
  const stats = await getDeviceStatus();
  const avg = stats?.data?.total > 0 ? Math.round((stats?.data?.online / stats?.data?.total) * 100) : 0;
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Devices"
        data={{
          ...stats.data.total,
          value: compactFormat(stats?.data?.total),
        }}
      />

      <OverviewCard
        label="Online"
        data={{
          ...stats.data.online,
          value: compactFormat(stats?.data?.online),
        }}
      />

      <OverviewCard
        label="Offiline"
        data={{
          ...stats.data.offline,
          value: compactFormat(stats?.data?.offline),
        }}
      />

      <OverviewCard
        label="Avg Uptime"
        data={{
          ...avg,
          value: compactFormat(avg),
        }}
      />
    </div>
  );
}
