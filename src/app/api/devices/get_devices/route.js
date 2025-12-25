import { NextResponse } from 'next/server';
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import { getDevices, parseDeviceData } from '@/lib/GenieACS';
import { GetSessionFromServer } from '@/lib/GetSessionfromServer';

export async function GET() {
  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId } 
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, message: 'Configuration not found.' },
        { status: 404 }
      );
    }

    if (credential.is_connected != 1) {
      return NextResponse.json(
        { success: false, message: 'Configuration is not connected' },
        { status: 404 }
      );
    }

    // Ambil semua device
    const devicesResult = await getDevices(credential.user_id);

    if (!devicesResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Get devices failed',
        error: devicesResult.error || 'Unknown error'
      });
    }

    // Pakai parser lengkap → semua field pasti muncul
    const devices = devicesResult.data.map(device =>
      parseDeviceData(device)
    );

    return NextResponse.json({
      success: true,
      devices,
      count: devices.length
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error: ' + error.message },
      { status: 500 }
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
