import { getDevices } from "@/lib/GenieACS";
import { NextResponse } from "next/server";
import { parseDeviceDataFast } from "@/lib/GenieACSFast";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function GET() {
  const session = await GetSessionFromServer();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session?.user?.id;
  try {
    // 🔹 Ambil devices berdasarkan user
    const devicesResult = await getDevices(userId, {});
    if (!devicesResult?.success) {
      return NextResponse.json(
        { success: false, message: "Get Device Data failed." },
        { status: 400 }
      );
    }

    let excellent = 0;
    let good = 0;
    let fair = 0;
    let poor = 0;
    let noSignal = 0;

    for (const device of devicesResult.data) {
      const { rx_power } = parseDeviceDataFast(device);

      if (!rx_power || rx_power === "N/A") {
        noSignal++;
        continue;
      }

      const rx = Number(rx_power);

      if (rx > -20) excellent++;
      else if (rx >= -25) good++;
      else if (rx >= -28) fair++;
      else poor++;
    }

    return NextResponse.json({
      success: true,
      data: {
        excellent,
        good,
        fair,
        poor,
        no_signal: noSignal,
        total: devicesResult.data.length,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
