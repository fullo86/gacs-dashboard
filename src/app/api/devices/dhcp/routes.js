import { NextResponse } from "next/server";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { genieacsRequest } from "@/lib/GenieACS";

/**
 * Update DHCP Server Configuration
 */
export async function POST(request) {
  try {
    // 🔐 require login
    const session = await GetSessionFromServer();
    const userId = session?.user?.id;

    if (!session || !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 ambil body
    const body = await request.json();
    const { device_id, parameters } = body;

    if (!device_id || !parameters) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: device_id, parameters" },
        { status: 400 }
      );
    }

    if (Object.keys(parameters).length === 0) {
      return NextResponse.json(
        { success: false, message: "No parameters provided for update" },
        { status: 400 }
      );
    }

    // 🔒 allowed parameter mapping
    const basePath = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement";

    const allowedParams = {
      DHCPServerEnable: "DHCPServerEnable",
      DHCPServerConfigurable: "DHCPServerConfigurable",
      MinAddress: "MinAddress",
      MaxAddress: "MaxAddress",
      SubnetMask: "SubnetMask",
      DNSServers: "DNSServers",
      IPRouters: "IPRouters",
      DHCPLeaseTime: "DHCPLeaseTime",
    };

    // 🧩 build GenieACS parameters
    const genieParams = {};

    for (const key of Object.keys(parameters)) {
      if (!allowedParams[key]) {
        return NextResponse.json(
          { success: false, message: `Invalid parameter: ${key}` },
          { status: 400 }
        );
      }

      genieParams[`${basePath}.${allowedParams[key]}`] = parameters[key];
    }

    // 🧪 VALIDATIONS
    const isValidIP = (ip) => {
      const parts = ip.split(".");
      return (
        parts.length === 4 &&
        parts.every(p => !isNaN(p) && Number(p) >= 0 && Number(p) <= 255)
      );
    };

    if (parameters.MinAddress && !isValidIP(parameters.MinAddress)) {
      return NextResponse.json({ success: false, message: "Invalid MinAddress IP format" }, { status: 400 });
    }

    if (parameters.MaxAddress && !isValidIP(parameters.MaxAddress)) {
      return NextResponse.json({ success: false, message: "Invalid MaxAddress IP format" }, { status: 400 });
    }

    if (parameters.SubnetMask && !isValidIP(parameters.SubnetMask)) {
      return NextResponse.json({ success: false, message: "Invalid SubnetMask format" }, { status: 400 });
    }

    if (parameters.IPRouters && !isValidIP(parameters.IPRouters)) {
      return NextResponse.json({ success: false, message: "Invalid IPRouters format" }, { status: 400 });
    }

    if (parameters.DNSServers) {
      const dnsList = parameters.DNSServers.split(",");
      for (const dns of dnsList) {
        if (dns.trim() && !isValidIP(dns.trim())) {
          return NextResponse.json(
            { success: false, message: `Invalid DNS server IP: ${dns}` },
            { status: 400 }
          );
        }
      }
    }

    if (parameters.DHCPLeaseTime) {
      const lease = Number(parameters.DHCPLeaseTime);
      if (lease < 60) {
        return NextResponse.json(
          { success: false, message: "DHCPLeaseTime must be at least 60 seconds" },
          { status: 400 }
        );
      }
    }

    if (parameters.MinAddress && parameters.MaxAddress) {
      const min = parameters.MinAddress.split(".").reduce((a, b) => a * 256 + +b);
      const max = parameters.MaxAddress.split(".").reduce((a, b) => a * 256 + +b);

      if (min >= max) {
        return NextResponse.json(
          { success: false, message: "MinAddress must be less than MaxAddress" },
          { status: 400 }
        );
      }
    }

    // 🔑 ambil credential GenieACS
    const credential = await GenieacsCredential.findOne({
      where: { user_id: userId },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "GenieACS credentials not configured" },
        { status: 404 }
      );
    }

    // 🚀 kirim task ke GenieACS
    const result = await genieacsRequest(
      userId,
      `/devices/${encodeURIComponent(device_id)}/tasks`,
      "POST",
      {
        name: "setParameterValues",
        parameterValues: genieParams,
      }
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "DHCP server configuration updated successfully",
        task_status: result.status === 200 ? "immediate" : "queued",
        parameters_updated: Object.keys(genieParams).length,
        dhcp_enabled: parameters.DHCPServerEnable ?? null,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update DHCP configuration",
        error: result.error,
      },
      { status: 500 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
