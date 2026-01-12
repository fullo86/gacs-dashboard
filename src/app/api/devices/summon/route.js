import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { summonAndFetchAdminCredentials } from "@/lib/GenieACS";

export async function POST(request) {
  try {
    const session = await GetSessionFromServer();

    if (!session) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;

    const body = await request.json();
    const { device_id } = body;

    if (!device_id) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "device_id is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: "Configuration not found." },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (!credential.is_connected) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.CONFLICT,
          message: "Configuration is not connected",
        },
        { status: StatusCodes.CONFLICT }
      );
    }

    const result = await summonAndFetchAdminCredentials(
      userId,
      device_id
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        status_code: StatusCodes.OK,
        message:
          "Device Successfully Summoned",
        data: result
      }, { status: StatusCodes.OK });
    }

    let errorMsg = "Failed when summoned device";
    if (result.error) {errorMsg += ": " + result.error}
    if (result.status) {errorMsg += " (HTTP " + result.status + ")"}

    return NextResponse.json(
      { success: false, status_code: StatusCodes.BAD_GATEWAY, message: errorMsg },
      { status: StatusCodes.BAD_GATEWAY }
    )
  } catch (err) {
    console.log("SUMMON API ERROR:", err);
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
