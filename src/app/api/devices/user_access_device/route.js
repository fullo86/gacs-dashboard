import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { getDevices, parseDeviceData } from "@/lib/GenieACS";

export async function POST(request) {
  try {
    const body = await request.json();
    const { serial_number, sec_key } = body;

    if (!serial_number || !sec_key) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.BAD_REQUEST,
          message: "serial_number and sec_key are required"
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const config = await GenieacsCredential.findOne({
      where: { sec_key }
    });

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.NOT_FOUND,
          message: "Security Key Is Not Valid"
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (config.is_connected === 0) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.CONFLICT,
          message: "Configuration is not connected"
        },
        { status: StatusCodes.CONFLICT }
      );
    }
    const cfgId = await config?.dataValues?.user_id
    const devicesResult = await getDevices(cfgId);

    if (!devicesResult.success) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.BAD_GATEWAY,
          message: "Get devices failed",
          error: devicesResult.error || "Unknown error"
        },
        { status: StatusCodes.BAD_GATEWAY }
      );
    }

    const device = (devicesResult.data || [])
      .map(parseDeviceData)
      .find(d => d.serial_number === serial_number);

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          status_code: StatusCodes.NOT_FOUND,
          message: "Device data not found"
        },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json(
      {
        success: true,
        status_code: StatusCodes.OK,
        message: "Device fetched successfully",
        device
      },
      { status: StatusCodes.OK }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status_code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error: " + error.message
      },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
