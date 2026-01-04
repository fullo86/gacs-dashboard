import { NextResponse } from "next/server";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";

export async function GET() {
  const session = await GetSessionFromServer();
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  const genieacs = await new GenieacsCredential()
  try {
    const stats = await genieacs.getDeviceStats();
    if (stats.success) {
      return NextResponse.json({ success: true, message: "Get Data Successfully", stats: stats.data }, 
        { status: 200 }
      );
    } else {
      return NextResponse.json({ success: false, message: 'Get Statistic failed' }, 
        { status: 400 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Internal server errr' }, 
      { status: 500 }
    );
  }
}
