import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import { getDeviceStatus, getUplinkStatus } from "../../fetch";
import axios from "axios";

export async function OverviewCardsGroup() {
  // const { devices, on_status, off_status, users } = await getOverviewData();
  const stats = await getDeviceStatus();
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Devices"
        data={{
          ...stats.data.total,
          value: compactFormat(stats.data.total),
        }}
      />

      <OverviewCard
        label="Online"
        data={{
          ...stats.data.online,
          value: compactFormat(stats.data.online),
        }}
      />

      <OverviewCard
        label="Offiline"
        data={{
          ...stats.data.offline,
          value: compactFormat(stats.data.offline),
        }}
      />

      {/* <OverviewCard
        label="Total Users"
        data={{
          ...users,
          value: compactFormat(users.value),
        }}
      /> */}
    </div>
  );
}
