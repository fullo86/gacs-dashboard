import { NextResponse } from 'next/server';
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import { getDevices, parseDeviceData } from '@/lib/GenieACS';
import { GetSessionFromServer } from '@/lib/GetSessionfromServer';

export async function GET() {
  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = session.user.id;
    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId } 
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.NOT_FOUND, message: 'Configuration not found.' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    if (credential.is_connected != 1) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.CONFLICT, message: 'Configuration is not connected' },
        { status: StatusCodes.CONFLICT }
      );
    }

    const devicesResult = await getDevices(credential.user_id);

    if (!devicesResult.success) {
      return NextResponse.json({
        success: false,
        status_code: StatusCodes.BAD_GATEWAY,
        message: 'Get devices failed',
        error: devicesResult.error || 'Unknown error'
      }, { status: StatusCodes.BAD_GATEWAY });
    }

    const devices = (devicesResult.data || []).map(device =>
      parseDeviceData(device)
    );

    return NextResponse.json({
      success: true,
      status_code: StatusCodes.OK,
      message: " Get Devices Successfully ",
      devices,
      count: devices.length
    }, { status: StatusCodes.OK });

  } catch (error) {
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error: ' + error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}


// import { getServerSession } from 'next-auth';
// import { authOptions } from '../../auth/[...nextauth]/route';
// import { NextResponse } from 'next/server';
// import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
// import { parseDeviceDataFast } from '@/lib/GenieACSFast';
// import { getDevices, parseDeviceData } from '@/lib/GenieACS';

// export async function GET(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const userId = session.user.id;
//     const url = new URL(request.url);
//     const limit = parseInt(url.searchParams.get('limit')) || 100;
//     const skip = parseInt(url.searchParams.get('skip')) || 0;
//     const parser = url.searchParams.get('parser') || 'fast';
//     const useFastParser = parser === 'fast';

//     const credential = await GenieacsCredential.findOne({
//       where: {
//         user_id: userId      }
//     });

//     if (!credential) {
//       return NextResponse.json(
//         { success: false, message: 'Configuraton not found.' },
//         { status: 404 }
//       );
//     }

//     if (credential.is_connected != 1) {
//       return NextResponse.json(
//         { success: false, message: 'Configuration is not connected' },
//         { status: 404 }
//       );
//     }

//     const devicesResult = await getDevices(userId, {}, limit, skip);

//     if (!devicesResult.success) {
//       return NextResponse.json({
//         success: false,
//         message: 'Get devices failed',
//         error: devicesResult.error || 'Unknown error'
//       });
//     }

//     const devices = devicesResult.data.map(device =>
//       useFastParser
//         ? parseDeviceDataFast(device)
//         : parseDeviceData(device)
//     );

//     return NextResponse.json({
//       success: true,
//       devices,
//       count: devices.length,
//       hasMore: devices.length === limit,
//       pagination: {
//         limit,
//         skip,
//         returned: devices.length,
//         nextSkip: skip + limit
//       }
//     });

//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: 'Error: ' + error.message },
//       { status: 500 }
//     );
//   }
// }
