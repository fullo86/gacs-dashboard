import { getDeviceCount, getDeviceStats } from "@/lib/GenieACS";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function getTotalDevices() {
    const session = await GetSessionFromServer();
    const deviceCount = await getDeviceCount(session?.user?.id)
    return deviceCount
}

export async function getDeviceStatus() {
    const session = await GetSessionFromServer();
    const deviceStats = await getDeviceStats(session?.user?.id)

    if (!deviceStats?.success) {
    return {
      success: false,
      message: "Get Device Stats Failed",
      data: {
        total: 0,
        online: 0,
        offline: 0,
      },
    }
  }

    return deviceStats
}
