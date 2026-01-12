import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function GET() {
  const session = await GetSessionFromServer();
  if (!session) {
    return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' }, 
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  const genieacs = await new GenieacsCredential()
  try {
    const stats = await genieacs.getDeviceStats();
    if (stats.success) {
      return NextResponse.json({ success: true, status_code: StatusCodes.OK, message: "Get Data Successfully", stats: stats.data }, 
        { status: StatusCodes.OK }
      );
    } else {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: 'Get Statistic failed' }, 
        { status: StatusCodes.BAD_REQUEST }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Internal server errr' }, 
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
