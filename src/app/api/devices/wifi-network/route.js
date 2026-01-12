import { NextResponse } from 'next/server';
import { StatusCodes } from "http-status-codes";
import { GetSessionFromServer } from '@/lib/GetSessionfromServer';
import { WifiSchema } from '@/lib/validation';
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import { getDevice } from '@/lib/GenieACS';

export async function POST(req) {
  try {
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json({ success: false, status_code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' }, 
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const userId = await session?.user?.id
    const body = await req.json();
    const parsed = WifiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, status_code: StatusCodes.BAD_REQUEST, message: parsed.error.errors[0].message },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const { device_id, wifi_ssid, security_mode, wifi_password, wlan_index } = parsed.data;

    if (security_mode !== 'None') {
      if (!wifi_password || wifi_password.length < 8 || wifi_password.length > 63) {
        return NextResponse.json({ 
          success: false, 
          status_code: StatusCodes.BAD_REQUEST,
          message: 'WiFi Password must be between 8 and 63 characters' 
        }, { status : StatusCodes.BAD_REQUEST });
      }
    }

    const config = await GenieacsCredential.findOne({
        where: {
             user_id: userId 
        }
    }); 
    if (!config) {
      return NextResponse.json({ success: false, status_code: StatusCodes.NOT_FOUND, message: 'GenieACS not configured.' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const deviceResult = await getDevice(userId);
    let canConnectionRequest = true;

    if (deviceResult.success) {
      const device = deviceResult.data;
      let connectionUrl =
        device?.InternetGatewayDevice?.ManagementServer?.ConnectionRequestURL?._value ||
        device?.Device?.ManagementServer?.ConnectionRequestURL?._value;

      if (connectionUrl && /https?:\/\/(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(connectionUrl)) {
        canConnectionRequest = false;
      }
    }

    const result = await genieacs.setWiFiConfig(device_id, wifi_ssid, wifi_password, wlan_index, security_mode);

    if (result.success) {
      const httpCode = result.http_code || 0;
      if (httpCode === 200) {
        return NextResponse.json({
          success: true,
          message: 'WiFi configuration updated successfully! Device responded immediately.',
          data: { device_id, wifi_ssid, security_mode, wlan_index, response_time: 'immediate' }
        }, { status: StatusCodes.OK });
      } else if (httpCode === 202) {
        if (!canConnectionRequest) {
          return NextResponse.json({
            success: true,
            status_code: StatusCodes.ACCEPTED,
            message: 'WiFi configuration task queued successfully. Device is behind NAT - changes will apply on next inform cycle (30-60 min) or you can manually reboot.',
            data: { device_id, wifi_ssid, security_mode, wlan_index, response_time: 'delayed', reason: 'nat', estimated_wait: '30-60 minutes or manual reboot' }
          }, { status: StatusCodes.ACCEPTED });
        } else {
          return NextResponse.json({
            success: true,
            status_code: StatusCodes.ACCEPTED,
            message: 'WiFi configuration task queued. Device will update when it connects to GenieACS.',
            data: { device_id, wifi_ssid, security_mode, wlan_index, response_time: 'delayed' }
          }, { status: StatusCodes.ACCEPTED });
        }
      } else {
        return NextResponse.json({
          success: true,
          status_code: httpCode,
          message: 'WiFi configuration task sent to device.',
          data: { device_id, wifi_ssid, security_mode, wlan_index, http_code: httpCode }
        }, { status: httpCode });
      }
    } else {
      return NextResponse.json({
        success: false,
        status_code: StatusCodes.BAD_GATEWAY,
        message: result.error || 'Failed to update WiFi configuration',
        data: { device_id, http_code: result.http_code || 0 }
      }, { status: StatusCodes.BAD_GATEWAY });
    }

  } catch (err) {
    return NextResponse.json({ success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: 'Error: ' + err.message }, 
      { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
