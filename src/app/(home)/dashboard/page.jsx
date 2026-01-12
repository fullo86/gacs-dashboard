import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import RecentDevicesPage from "./recentdevices";
import DeviceOverviewChart from "./_components/charts/DeviceOverviewChart";
import UplinkStatsChart from "./_components/charts/UplinkStatsChart";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export default async function Home({ searchParams }) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const session = await GetSessionFromServer()
  const isPaymentActive = await session?.user?.active_trx

  return isPaymentActive ? (
    <>
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCardsGroup />
        </Suspense>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
          <DeviceOverviewChart
            className="col-span-12 xl:col-span-6"
            key={extractTimeFrame("used_devices")}
            timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
          />

          <UplinkStatsChart
            className="col-span-12 xl:col-span-6"
            key={extractTimeFrame("used_devices")}
            timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
          />

          <div className="col-span-12 grid xl:col-span-12 mt-4">
            <Suspense fallback={null}>
              <RecentDevicesPage className="col-span-12" />
            </Suspense>
          </div>
        </div>        
    </>
  ) :  <DashboardInactive />;
}
