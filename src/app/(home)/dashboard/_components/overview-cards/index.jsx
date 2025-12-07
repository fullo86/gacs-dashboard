import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";

export async function OverviewCardsGroup() {
  const { devices, on_status, off_status, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Devices"
        data={{
          ...devices,
          value: compactFormat(devices.value),
        }}
      />

      <OverviewCard
        label="Online"
        data={{
          ...on_status,
          value: compactFormat(on_status.value),
        }}
      />

      <OverviewCard
        label="Offiline"
        data={{
          ...off_status,
          value: compactFormat(off_status.value),
        }}
      />

      <OverviewCard
        label="Total Users"
        data={{
          ...users,
          value: compactFormat(users.value),
        }}
      />
    </div>
  );
}
