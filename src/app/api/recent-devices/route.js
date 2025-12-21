import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { getDevices } from "@/lib/GenieACS";
import { NextResponse } from "next/server";
import { parseDeviceDataFast } from "@/lib/GenieACSFast";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const userId = session.user.id;
    const config = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!config) {
      return NextResponse.json(
        { success: false, message: 'Configuraton not found.' },
        { status: 404 }
      );
    }

    if (config.is_connected != 1) {
      return NextResponse.json(
        { success: false, message: 'Configuration is not connected' },
        { status: 404 }
      );
    }

    const result = await getDevices(userId);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch devices from GenieACS",
      });
    }

    const recentDevices = result.data.map((device) => {
      const parsed = parseDeviceDataFast(device);
      parsed.last_inform_timestamp = device._lastInform
        ? new Date(device._lastInform).getTime()
        : 0;
      return parsed;
    });

    recentDevices.sort((a, b) => b.last_inform_timestamp - a.last_inform_timestamp);

    const topDevices = recentDevices.slice(0, 5);

    return NextResponse.json({ success: true, devices: topDevices });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
