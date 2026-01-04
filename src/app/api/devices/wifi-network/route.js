import { NextResponse } from 'next/server';
import { GetSessionFromServer } from '@/lib/GetSessionfromServer';
import { WifiSchema } from '@/lib/validation';
import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import { getDevice } from '@/lib/GenieACS';

export async function POST(req) {
  try {
    // autentikasi NextAuth
    const session = await GetSessionFromServer();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const userId = await session?.user?.id
    const body = await req.json();
    const parsed = WifiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { device_id, wifi_ssid, security_mode, wifi_password, wlan_index } = parsed.data;

    if (security_mode !== 'None') {
      if (!wifi_password || wifi_password.length < 8 || wifi_password.length > 63) {
        return NextResponse.json({ 
          success: false, 
          message: 'WiFi Password must be between 8 and 63 characters' 
        }, { status : 400 });
      }
    }

    const config = await GenieacsCredential.findOne({
        where: {
             user_id: userId 
        }
    }); 
    if (!config) {
      return NextResponse.json({ success: false, message: 'GenieACS not configured.' });
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
        }, { status: 200 });
      } else if (httpCode === 202) {
        if (!canConnectionRequest) {
          return NextResponse.json({
            success: true,
            message: 'WiFi configuration task queued successfully. Device is behind NAT - changes will apply on next inform cycle (30-60 min) or you can manually reboot.',
            data: { device_id, wifi_ssid, security_mode, wlan_index, response_time: 'delayed', reason: 'nat', estimated_wait: '30-60 minutes or manual reboot' }
          });
        } else {
          return NextResponse.json({
            success: true,
            message: 'WiFi configuration task queued. Device will update when it connects to GenieACS.',
            data: { device_id, wifi_ssid, security_mode, wlan_index, response_time: 'delayed' }
          });
        }
      } else {
        return NextResponse.json({
          success: true,
          message: 'WiFi configuration task sent to device.',
          data: { device_id, wifi_ssid, security_mode, wlan_index, http_code: httpCode }
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || 'Failed to update WiFi configuration',
        data: { device_id, http_code: result.http_code || 0 }
      });
    }

  } catch (err) {
    return NextResponse.json({ success: false, message: 'Error: ' + err.message }, { status: 500 });
  }
}
