import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { summonAndFetchAdminCredentials } from "@/lib/GenieACS";

export async function POST(request) {
  try {

    const body = await request.json();
    const { device_id, sec_key } = body;

    const credential = await GenieacsCredential.findOne({
        where: { sec_key }
    });

    if (!device_id) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "device_id is required" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

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

    const crdId = await credential?.dataValues?.user_id
    const result = await summonAndFetchAdminCredentials(
      crdId,
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
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
