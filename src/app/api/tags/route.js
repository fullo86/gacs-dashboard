import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import DeviceTags from "@/models/tags/DeviceTags";

export async function POST(request) {
  try {
    const session = await GetSessionFromServer();
    const userId = session?.user?.id;

    if (!session || !userId) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.UNAUTHORIZED, message: "Unauthorized" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const { action, device_ids: deviceIds, tag } = body;

    if (!action || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "Missing required fields: action, device_ids" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const tagName = tag ? tag.trim() : "";

    if (action === "add" && !tagName) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: "Tag name cannot be empty for add action" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (!["add", "remove"].includes(action)) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.BAD_REQUEST, message: 'Invalid action. Use "add" or "remove"' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId, is_connected: true },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, status_code: StatusCodes.CONFLICT, message: "GenieACS credentials not configured" },
        { status: StatusCodes.CONFLICT }
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

      try {
        if (action === "add") {
          const url = `${baseUrl}/devices/${encodedDeviceId}/tags/${encodeURIComponent(tagName)}`;

          const response = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Basic ${auth}` },
          });

          const responseText = await response.text();
          debugInfo.push({
            device_id: deviceId,
            method: "POST",
            url,
            http_code: response.status,
            response: responseText,
          });

          if (!response.ok) {
            failCount++;
            errors.push(`Device ${deviceId}: HTTP ${response.status}`);
            continue;
          }

          await DeviceTags.findOrCreate({
            where: { device_id: deviceId, tags: tagName },
            defaults: { id: uuidv4() },
          });

          successCount++;
        }
        else if (action === "remove") {
          if (tagName) {
            const url = `${baseUrl}/devices/${encodedDeviceId}/tags/${encodeURIComponent(tagName)}`;

            const response = await fetch(url, {
              method: "DELETE",
              headers: { Authorization: `Basic ${auth}` },
            });

            const responseText = await response.text();
            debugInfo.push({
              device_id: deviceId,
              method: "DELETE",
              url,
              http_code: response.status,
              response: responseText,
            });

            if (!response.ok) {
              failCount++;
              errors.push(
                `Device ${deviceId}: Failed to delete tag '${tagName}' (HTTP ${response.status})`
              );
              continue;
            }

            await DeviceTags.destroy({
              where: { device_id: deviceId, tags: tagName },
            });

            successCount++;
          }
          else {
            const tags = await DeviceTags.findAll({
              where: { device_id: deviceId },
            });

            if (tags.length === 0) continue;

            const deletedTagNames = [];

            for (const t of tags) {
              const url = `${baseUrl}/devices/${encodedDeviceId}/tags/${encodeURIComponent(t.tags)}`;

              try {
                const response = await fetch(url, {
                  method: "DELETE",
                  headers: { Authorization: `Basic ${auth}` },
                });

                const responseText = await response.text();
                debugInfo.push({
                  device_id: deviceId,
                  method: "DELETE",
                  url,
                  http_code: response.status,
                  response: responseText,
                });

                if (response.ok) {
                  successCount++;
                  deletedTagNames.push(t.tags);
                } else {
                  failCount++;
                  errors.push(
                    `Device ${deviceId}: Failed to delete tag '${t.tags}' (HTTP ${response.status})`
                  );
                }
              } catch (err) {
                failCount++;
                errors.push(`Device ${deviceId}: ${err.message}`);
              }
            }
            if (deletedTagNames.length > 0) {
              await DeviceTags.destroy({
                where: {
                  device_id: deviceId,
                  tags: deletedTagNames,
                },
              });
            }
          }
        }
      } catch (err) {
        failCount++;
        errors.push(`Device ${deviceId}: ${err.message}`);
        debugInfo.push({ device_id: deviceId, error: err.message });
      }
    }
    const message =
      successCount > 0
        ? action === "add"
          ? `Tag '${tagName}' added to ${successCount} device(s)`
          : tagName
          ? `Tag '${tagName}' removed from ${successCount} device(s)`
          : `All tags removed from ${successCount} device(s)`
        : "Failed to update tags for all devices";

    return NextResponse.json(
      {
        success: successCount > 0,
        status_code: StatusCodes.OK,
        message: message + (failCount > 0 ? ` (${failCount} failed)` : ""),
        success_count: successCount,
        fail_count: failCount,
        errors,
        debug: debugInfo,
      },
      { status: StatusCodes.OK }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, status_code: StatusCodes.INTERNAL_SERVER_ERROR, message: err.message || "Server error" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
