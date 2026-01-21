import { Suspense } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import RecentDevicesPage from "./recentdevices";

export default function DashboardInactive() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900">
      {/* Overview cards placeholder */}
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-12 md:col-span-4 bg-gray-100 dark:bg-gray-800 rounded p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Total Devices
            </h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              0
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 bg-gray-100 dark:bg-gray-800 rounded p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Uplink Stats
            </h2>
            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">
              -
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 bg-gray-100 dark:bg-gray-800 rounded p-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Used Devices
            </h2>
            <p className="text-2xl font-bold text-gray-500 dark:text-gray-400">
              -
            </p>
          </div>
        </div>
      </Suspense>

      {/* Charts placeholder */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 xl:col-span-6 bg-gray-50 dark:bg-gray-800 rounded h-64 flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">
            Device Overview Chart (tersedia setelah aktif)
          </p>
        </div>

        <div className="col-span-12 xl:col-span-6 bg-gray-50 dark:bg-gray-800 rounded h-64 flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">
            Uplink Stats Chart (tersedia setelah aktif)
          </p>
        </div>
      </div>

      {/* Recent devices placeholder */}
      <div className="col-span-12 bg-gray-50 dark:bg-gray-800 rounded p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Recent Devices
        </h2>
        <p className="text-gray-400 dark:text-gray-500">
          Tidak ada data. Aktifkan paket untuk melihat perangkat terbaru.
        </p>
      </div>
    </div>
  );
}
