import { NextResponse } from "next/server";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { summonAndFetchAdminCredentials } from "@/lib/GenieACS";

export async function POST(request) {
  try {
    const session = await GetSessionFromServer();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const body = await request.json();
    const { device_id } = body;

    if (!device_id) {
      return NextResponse.json(
        { success: false, message: "device_id is required" },
        { status: 400 }
      );
    }

    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "Configuration not found." },
        { status: 404 }
      );
    }

    if (!credential.is_connected) {
      return NextResponse.json(
        {
          success: false,
          message: "Configuration is not connected",
        },
        { status: 400 }
      );
    }

    const result = await summonAndFetchAdminCredentials(
      userId,
      device_id
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message:
          "Device Successfully Summoned",
        data: result
      });
    }

    let errorMsg = "Failed when summoned device";
    if (result.error) {errorMsg += ": " + result.error}
    if (result.status) {errorMsg += " (HTTP " + result.status + ")"}

    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    )
  } catch (err) {
    console.log("SUMMON API ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
