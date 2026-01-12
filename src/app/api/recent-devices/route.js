import { NextResponse } from "next/server";
import { getDevices } from "@/lib/GenieACS";
import { parseDeviceDataFast } from "@/lib/GenieACSFast";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { StatusCodes } from "http-status-codes";

export async function GET() {
  const session = await GetSessionFromServer();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const userId = session.user.id;
    const config = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!config) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: 'Configuraton not found.' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (config.is_connected != 1) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.CONFLICT, message: 'Configuration is not connected' },
        { status: StatusCodes.CONFLICT }
      );
    }

    const result = await getDevices(userId);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        status_code: StatusCodes.BAD_GATEWAY,
        message: "Failed to fetch devices from GenieACS",
      }, { status: StatusCodes.BAD_GATEWAY });
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

    return NextResponse.json({ success: true, status_code: StatusCodes.OK, devices: topDevices }, 
      { status: StatusCodes.OK }
    );
  } catch (error) {
    return NextResponse.json({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: error.message }, 
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
