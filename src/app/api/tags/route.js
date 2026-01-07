import { NextResponse } from "next/server";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";

export async function POST(request) {
  try {
    const session = await GetSessionFromServer();
    const userId = session?.user?.id;

    if (!session || !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { action, device_ids: deviceIds, tag } = body;

    if (!action || !deviceIds || !tag) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: action, device_ids, tag" },
        { status: 400 }
      );
    }

    if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No devices selected" },
        { status: 400 }
      );
    }

    const tagName = tag.trim();
    if (!tagName) {
      return NextResponse.json(
        { success: false, message: "Tag name cannot be empty" },
        { status: 400 }
      );
    }

    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId, is_connected: true },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "GenieACS credentials not configured" },
        { status: 404 }
      );
    }

    const baseUrl = `http://${credential.host}:${credential.port}`;
    const auth = Buffer.from(`${credential.username}:${credential.password}`).toString("base64");

    let successCount = 0;
    let failCount = 0;
    const errors = [];
    const debugInfo = [];

    for (const deviceId of deviceIds) {
      const encodedDeviceId = encodeURIComponent(deviceId);
      const url = `${baseUrl}/devices/${encodedDeviceId}/tags/${encodeURIComponent(tagName)}`;
      const method = action === "add" ? "POST" : action === "remove" ? "DELETE" : null;

      if (!method) {
        return NextResponse.json(
          { success: false, message: 'Invalid action. Use "add" or "remove"' },
          { status: 400 }
        );
      }

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/json",
          },
        });

        const responseText = await response.text();

        debugInfo.push({
          device_id: deviceId,
          url,
          method,
          http_code: response.status,
          response: responseText,
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          errors.push(`Device ${deviceId}: HTTP ${response.status}`);
        }

      } catch (err) {
        failCount++;
        errors.push(`Device ${deviceId}: ${err.message}`);
        debugInfo.push({ device_id: deviceId, error: err.message });
      }
    }

    const message = successCount > 0
      ? (action === "add"
          ? `Tag '${tagName}' added to ${successCount} device(s)`
          : `Tag '${tagName}' removed from ${successCount} device(s)`)
      : "Failed to update tags for all devices";

    return NextResponse.json({
      success: successCount > 0,
      message: message + (failCount > 0 ? ` (${failCount} failed)` : ""),
      success_count: successCount,
      fail_count: failCount,
      errors,
      debug: debugInfo
    }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
