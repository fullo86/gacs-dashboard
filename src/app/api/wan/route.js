import { NextResponse } from "next/server";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { setParameterValues } from "@/lib/GenieACS";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import { StatusCodes } from "http-status-codes";

export async function POST(req) {
  try {
    // Ambil session user
    const session = await GetSessionFromServer();
    const userId = session?.user?.id;

    if (!session || !userId) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await req.json();
    const { device_id, connection_type, parameters } = body;

    // Validasi input
    if (!device_id || !connection_type || !parameters) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const typeLower = connection_type.toLowerCase();
    if (!["pppoe", "dhcp", "bridge", "ip_routed"].includes(typeLower)) {
      return NextResponse.json(
        { success: false, message: "Invalid connection type" },
        { status: 400 }
      );
    }

    // Cek credential GenieACS
    const genie = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!genie) {
      return NextResponse.json(
        { success: false, message: "GenieACS credentials not configured" },
        { status: 500 }
      );
    }
    console.log(device_id)

    // Panggil setParameterValues dengan userId, deviceId, parameters
    const result = await setParameterValues(userId, device_id, parameters, 10000);

    return NextResponse.json({
      success: true,
      message: "WAN added successfully",
      genieResult: result,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
