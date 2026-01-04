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

// export async function getDevicesRXData() {
//   try {
//     const response = await fetch(`${process.env.BASE_URL}/api/uplink-stats`);
//     console.log(response, 'ini respo')
//     const result = await response.json();
// console.log(result, 'ini ressssss')

//     if (!result.success || !result.data) {
//       return [
//         { name: "Excellent", amount: 0, percentage: 0 },
//         { name: "Good", amount: 0, percentage: 0 },
//         { name: "Fair", amount: 0, percentage: 0 },
//         { name: "Poor", amount: 0, percentage: 0 },
//         { name: "No Signal", amount: 0, percentage: 0 },
//       ];
//     }

//     return result.data;
//   } catch (error) {
//     console.log("Error fetching devices from API:", error);

//     return [
//       { name: "Excellent", amount: 0, percentage: 0 },
//       { name: "Good", amount: 0, percentage: 0 },
//       { name: "Fair", amount: 0, percentage: 0 },
//       { name: "Poor", amount: 0, percentage: 0 },
//       { name: "No Signal", amount: 0, percentage: 0 },
//     ];
//   }
// }
