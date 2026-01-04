// src/app/api/dashboard/used-devices/route.js
import { NextResponse } from "next/server";
import { getDevices } from "@/lib/GenieACS";
import { parseDeviceDataFast } from "@/lib/GenieACSFast";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

// Fungsi kategorisasi RX Power
function categorizeRXPower(rxPower) {
  const rx = Number(rxPower);
  if (isNaN(rx)) return "no_signal";

  if (rx > -20) return "excellent";
  if (rx >= -25) return "good";
  if (rx >= -28) return "fair";
  return "poor";
}

export async function GET() {
  const session = await GetSessionFromServer();
  const userId = await session?.user?.id;

  try {
    const devicesResult = await getDevices(userId, {});
    if (!devicesResult?.success) {
      return NextResponse.json(
        { success: false, message: "Get Device Data failed." },
        { status: 400 }
      );
    }

    let categories = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      no_signal: 0,
    };

    devicesResult.data.forEach((device) => {
      const { rx_power } = parseDeviceDataFast(device);
      const category = categorizeRXPower(rx_power);
      categories[category] += 1;
    });

    const total = await devicesResult.data.length;

    const chartData = [
      { name: "Excellent", amount: categories.excellent, percentage: total ? (categories.excellent / total) * 100 : 0 },
      { name: "Good", amount: categories.good, percentage: total ? (categories.good / total) * 100 : 0 },
      { name: "Fair", amount: categories.fair, percentage: total ? (categories.fair / total) * 100 : 0 },
      { name: "Poor", amount: categories.poor, percentage: total ? (categories.poor / total) * 100 : 0 },
      { name: "No Signal", amount: categories.no_signal, percentage: total ? (categories.no_signal / total) * 100 : 0 },
    ];

    return NextResponse.json(
      { success: true, data: chartData, total },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
