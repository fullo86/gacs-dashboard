// app/api/dhcp/update/route.js
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
import { NextResponse } from "next/server";

// TR-069 base path untuk DHCP
const BASE_PATH = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement";

// Parameter yang diizinkan
const ALLOWED_PARAMS = {
  DHCPServerEnable: "DHCPServerEnable",
  DHCPServerConfigurable: "DHCPServerConfigurable",
  MinAddress: "MinAddress",
  MaxAddress: "MaxAddress",
  SubnetMask: "SubnetMask",
  DNSServers: "DNSServers",
  IPRouters: "IPRouters",
  DHCPLeaseTime: "DHCPLeaseTime",
};

// Validasi IP
const isValidIP = (ip) => {
  const parts = ip.split(".");
  return parts.length === 4 && parts.every((p) => !isNaN(p) && Number(p) >= 0 && Number(p) <= 255);
};

// Konversi IP ke number
const ipToNumber = (ip) => ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);

// Build parameter untuk GenieACS
const buildGenieParams = (parameters) => {
  const result = {};
  for (const key in parameters) {
    if (!ALLOWED_PARAMS[key]) throw new Error(`Invalid parameter: ${key}`);
    result[`${BASE_PATH}.${ALLOWED_PARAMS[key]}`] = parameters[key];
  }
  return result;
};

export async function POST(req) {
  try {
    // Ambil session NextAuth
    const session = await GetSessionFromServer();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id
    const body = await req.json();
    const { device_id, parameters } = body;

    if (!device_id || !parameters || Object.keys(parameters).length === 0) {
      return NextResponse.json({ success: false, message: "Missing required fields: device_id or parameters" }, { status: 400 });
    }

    // Ambil credential GenieACS dari database sesuai user yang login
    const genie = await GenieacsCredential.findOne({ where: { user_id: userId } });

    if (!genie) {
      return NextResponse.json({ success: false, message: "GenieACS credentials not configured" }, { status: 500 });
    }

    const { host, port, username, password } = genie;
    if (!host || !port) {
      return NextResponse.json({ success: false, message: "GenieACS host or port not set" }, { status: 500 });
    }

    // Validasi IP & lease time
    if (parameters.MinAddress && !isValidIP(parameters.MinAddress)) return NextResponse.json({ success: false, message: "Invalid MinAddress IP" }, { status: 400 });
    if (parameters.MaxAddress && !isValidIP(parameters.MaxAddress)) return NextResponse.json({ success: false, message: "Invalid MaxAddress IP" }, { status: 400 });
    if (parameters.SubnetMask && !isValidIP(parameters.SubnetMask)) return NextResponse.json({ success: false, message: "Invalid SubnetMask IP" }, { status: 400 });
    if (parameters.IPRouters && !isValidIP(parameters.IPRouters)) return NextResponse.json({ success: false, message: "Invalid IPRouters IP" }, { status: 400 });

    if (parameters.DNSServers) {
      const dnsServers = parameters.DNSServers.split(",").map(d => d.trim());
      for (const dns of dnsServers) {
        if (!isValidIP(dns)) return NextResponse.json({ success: false, message: `Invalid DNS IP: ${dns}` }, { status: 400 });
      }
    }

    if (parameters.DHCPLeaseTime && parameters.DHCPLeaseTime < 60) return NextResponse.json({ success: false, message: "DHCPLeaseTime must be at least 60 seconds" }, { status: 400 });

    if (parameters.MinAddress && parameters.MaxAddress) {
      if (ipToNumber(parameters.MinAddress) >= ipToNumber(parameters.MaxAddress)) {
        return NextResponse.json({ success: false, message: "MinAddress must be less than MaxAddress" }, { status: 400 });
      }
    }

    // Build payload untuk GenieACS
    const genieParams = buildGenieParams(parameters);
    const payload = {
      name: "setParameterValues",
      parameterValues: Object.entries(genieParams).map(([name, value]) => {
        let type = "xsd:string";
        if (typeof value === "boolean") type = "xsd:boolean";
        if (typeof value === "number") type = "xsd:int";
        return { name, value, type };
      }),
    };

    const headers = { "Content-Type": "application/json" };
    if (username && password) {
      headers.Authorization = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
    }

    const url = `http://${host}:${port}/devices/${encodeURIComponent(device_id)}/tasks`;

    const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ success: false, message: "Failed to update DHCP configuration", error: errText }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "DHCP server configuration updated successfully",
      task_status: "queued",
      parameters_updated: Object.keys(genieParams).length,
      dhcp_enabled: parameters.DHCPServerEnable ?? null,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Internal server error", error: err.message }, { status: 500 });
  }
}
