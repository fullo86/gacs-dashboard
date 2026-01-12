import { Suspense } from "react";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import RecentDevicesPage from "./recentdevices";

export default function DashboardInactive() {
  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Dashboard Terbatas</h1>
      <p className="mb-6 text-gray-600">
        Paket Anda belum aktif. Beberapa fitur terbatas atau tidak tersedia.
      </p>

      {/* Overview cards placeholder */}
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-12 md:col-span-4 bg-gray-100 rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Total Devices</h2>
            <p className="text-2xl font-bold text-gray-800">0</p>
          </div>

          <div className="col-span-12 md:col-span-4 bg-gray-100 rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Uplink Stats</h2>
            <p className="text-2xl font-bold text-gray-800">-</p>
          </div>

          <div className="col-span-12 md:col-span-4 bg-gray-100 rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Used Devices</h2>
            <p className="text-2xl font-bold text-gray-800">-</p>
          </div>
        </div>
      </Suspense>

      {/* Charts placeholder */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 xl:col-span-6 bg-gray-50 rounded h-64 flex items-center justify-center">
          <p className="text-gray-400">Device Overview Chart (tersedia setelah aktif)</p>
        </div>

        <div className="col-span-12 xl:col-span-6 bg-gray-50 rounded h-64 flex items-center justify-center">
          <p className="text-gray-400">Uplink Stats Chart (tersedia setelah aktif)</p>
        </div>
      </div>

      {/* Recent devices placeholder */}
      <div className="col-span-12 bg-gray-50 rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Devices</h2>
        <p className="text-gray-400">Tidak ada data. Aktifkan paket untuk melihat perangkat terbaru.</p>
      </div>

      {/* Call to action */}
      <div className="mt-6 text-center">
        <a
          href="/payment"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Aktifkan Paket Sekarang
        </a>
      </div>
    </div>
  );
}
