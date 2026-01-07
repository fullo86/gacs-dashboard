import { getDeviceStats } from "@/lib/GenieACS";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function getServiceDeviceStatus() {
  const session = await GetSessionFromServer();
  const stats = await getDeviceStats(session?.user?.id);

  if (!stats.success || !stats.data) {
    return [
      { name: "Online", percentage: 0, amount: 0 },
      { name: "Offline", percentage: 0, amount: 0 },
    ];
  }

  const { online, offline } = stats.data;

  const data = [
    {
      name: "Online",
      amount: online
    },
    {
      name: "Offline",
      amount: offline
    },
  ];

  return data;
}
