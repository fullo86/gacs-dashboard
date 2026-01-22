import { NextResponse } from "next/server";
import axios from "axios";
import http from "http";
import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
import GenieacsCredential from "@/models/genieacs/GenieACSCredential";

const BASE_PATH = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement";
const ALLOWED_PARAMS = {
  DHCPServerEnable: "DHCPServerEnable",
  MinAddress: "MinAddress",
  MaxAddress: "MaxAddress",
  SubnetMask: "SubnetMask",
  DNSServers: "DNSServers",
  IPRouters: "IPRouters",
  DHCPLeaseTime: "DHCPLeaseTime",
};

// validasi IP
const isValidIP = (ip) => {
  if (!ip) return true;
  const parts = ip.split(".");
  return parts.length === 4 && parts.every(p => !isNaN(p) && Number(p) >= 0 && Number(p) <= 255);
};

// konversi IP ke number
const ipToNumber = (ip) => ip.split(".").reduce((acc, o) => (acc << 8) + Number(o), 0);

export async function POST(req) {
  try {
    // 1️⃣ Ambil session
    const session = await GetSessionFromServer();
    if (!session?.user?.id) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    // 2️⃣ Ambil body
    const { device_id, parameters } = await req.json();
    if (!device_id || !parameters) return NextResponse.json({ success: false, message: "device_id & parameters required" }, { status: 400 });

    // 3️⃣ Ambil credential GenieACS
    const genie = await GenieacsCredential.findOne({ where: { user_id: session.user.id } });
    if (!genie?.host || !genie?.port) return NextResponse.json({ success: false, message: "GenieACS credentials missing" }, { status: 500 });

    const url = `http://${genie.host}:${genie.port}/devices/${encodeURIComponent(device_id)}/tasks`;
    const headers = { "Content-Type": "application/json" };
    if (genie.username && genie.password) {
      headers.Authorization = "Basic " + Buffer.from(`${genie.username}:${genie.password}`).toString("base64");
    }

    // 4️⃣ HTTP agent keepAlive
    const agent = new http.Agent({ keepAlive: true, maxSockets: 1, timeout: 60000 });

    // 5️⃣ Validasi parameter
    if (parameters.MinAddress && !isValidIP(parameters.MinAddress)) return NextResponse.json({ success: false, message: "Invalid MinAddress" }, { status: 400 });
    if (parameters.MaxAddress && !isValidIP(parameters.MaxAddress)) return NextResponse.json({ success: false, message: "Invalid MaxAddress" }, { status: 400 });
    if (parameters.SubnetMask && !isValidIP(parameters.SubnetMask)) return NextResponse.json({ success: false, message: "Invalid SubnetMask" }, { status: 400 });
    if (parameters.IPRouters && !isValidIP(parameters.IPRouters)) return NextResponse.json({ success: false, message: "Invalid Gateway IP" }, { status: 400 });
    if (parameters.DNSServers) {
      for (const dns of parameters.DNSServers.split(",").map(d => d.trim())) {
        if (!isValidIP(dns)) return NextResponse.json({ success: false, message: `Invalid DNS IP: ${dns}` }, { status: 400 });
      }
    }
    if (parameters.DHCPLeaseTime && parameters.DHCPLeaseTime < 60) return NextResponse.json({ success: false, message: "Lease time minimum 60 seconds" }, { status: 400 });
    if (parameters.MinAddress && parameters.MaxAddress && ipToNumber(parameters.MinAddress) >= ipToNumber(parameters.MaxAddress)) return NextResponse.json({ success: false, message: "MinAddress must be less than MaxAddress" }, { status: 400 });

    // 6️⃣ Kirim parameter satu per satu
    const results = [];
    for (const [k, v] of Object.entries(parameters)) {
      if (!ALLOWED_PARAMS[k] || v === null || v === undefined) continue;

      // Untuk DNSServers, pisah per IP
      if (k === "DNSServers") {
        const dnsList = v.split(",").map(d => d.trim());
        for (const dns of dnsList) {
          const param = { name: `${BASE_PATH}.DNSServers`, value: dns, type: "xsd:string" };
          try {
            const res = await axios.post(url, { name: "setParameterValues", parameterValues: [param] }, { headers, httpAgent: agent, timeout: 60000 });
            results.push({ param: `DNSServers:${dns}`, success: true, data: res.data });
          } catch (err) {
            results.push({ param: `DNSServers:${dns}`, success: false, error: err.message });
          }
        }
      } else {
        const type = typeof v === "boolean" ? "xsd:boolean" : typeof v === "number" ? "xsd:int" : "xsd:string";
        const param = { name: `${BASE_PATH}.${k}`, value: v, type };
        try {
          const res = await axios.post(url, { name: "setParameterValues", parameterValues: [param] }, { headers, httpAgent: agent, timeout: 60000 });
          results.push({ param: k, success: true, data: res.data });
        } catch (err) {
          results.push({ param: k, success: false, error: err.message });
        }
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (err) {
    console.error("Backend ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal server error", error: err.message }, { status: 500 });
  }
}

// // app/api/dhcp/update/route.js
// import { GetSessionFromServer } from "@/lib/GetSessionfromServer";
// import GenieacsCredential from "@/models/genieacs/GenieACSCredential";
// import { NextResponse } from "next/server";

// // TR-069 base path untuk DHCP
// const BASE_PATH = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement";

// // Parameter yang diizinkan
// const ALLOWED_PARAMS = {
//   DHCPServerEnable: "DHCPServerEnable",
//   DHCPServerConfigurable: "DHCPServerConfigurable",
//   MinAddress: "MinAddress",
//   MaxAddress: "MaxAddress",
//   SubnetMask: "SubnetMask",
//   DNSServers: "DNSServers",
//   IPRouters: "IPRouters",
//   DHCPLeaseTime: "DHCPLeaseTime",
// };

// // Validasi IP
// const isValidIP = (ip) => {
//   const parts = ip.split(".");
//   return parts.length === 4 && parts.every((p) => !isNaN(p) && Number(p) >= 0 && Number(p) <= 255);
// };

// // Konversi IP ke number
// const ipToNumber = (ip) => ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);

// // Build parameter untuk GenieACS
// const buildGenieParams = (parameters) => {
//   const result = {};
//   for (const key in parameters) {
//     if (!ALLOWED_PARAMS[key]) throw new Error(`Invalid parameter: ${key}`);
//     result[`${BASE_PATH}.${ALLOWED_PARAMS[key]}`] = parameters[key];
//   }
//   return result;
// };

// export async function POST(req) {
//   try {
//     // Ambil session NextAuth
//     const session = await GetSessionFromServer();
//     if (!session?.user?.id) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }
//     const userId = session.user.id
//     const body = await req.json();
//     const { device_id, parameters } = body;

//     if (!device_id || !parameters || Object.keys(parameters).length === 0) {
//       return NextResponse.json({ success: false, message: "Missing required fields: device_id or parameters" }, { status: 400 });
//     }

//     // Ambil credential GenieACS dari database sesuai user yang login
//     const genie = await GenieacsCredential.findOne({ where: { user_id: userId } });

//     if (!genie) {
//       return NextResponse.json({ success: false, message: "GenieACS credentials not configured" }, { status: 500 });
//     }

//     const { host, port, username, password } = genie;
//     if (!host || !port) {
//       return NextResponse.json({ success: false, message: "GenieACS host or port not set" }, { status: 500 });
//     }

//     // Validasi IP & lease time
//     if (parameters.MinAddress && !isValidIP(parameters.MinAddress)) return NextResponse.json({ success: false, message: "Invalid MinAddress IP" }, { status: 400 });
//     if (parameters.MaxAddress && !isValidIP(parameters.MaxAddress)) return NextResponse.json({ success: false, message: "Invalid MaxAddress IP" }, { status: 400 });
//     if (parameters.SubnetMask && !isValidIP(parameters.SubnetMask)) return NextResponse.json({ success: false, message: "Invalid SubnetMask IP" }, { status: 400 });
//     if (parameters.IPRouters && !isValidIP(parameters.IPRouters)) return NextResponse.json({ success: false, message: "Invalid IPRouters IP" }, { status: 400 });

//     if (parameters.DNSServers) {
//       const dnsServers = parameters.DNSServers.split(",").map(d => d.trim());
//       for (const dns of dnsServers) {
//         if (!isValidIP(dns)) return NextResponse.json({ success: false, message: `Invalid DNS IP: ${dns}` }, { status: 400 });
//       }
//     }

//     if (parameters.DHCPLeaseTime && parameters.DHCPLeaseTime < 60) return NextResponse.json({ success: false, message: "DHCPLeaseTime must be at least 60 seconds" }, { status: 400 });

//     if (parameters.MinAddress && parameters.MaxAddress) {
//       if (ipToNumber(parameters.MinAddress) >= ipToNumber(parameters.MaxAddress)) {
//         return NextResponse.json({ success: false, message: "MinAddress must be less than MaxAddress" }, { status: 400 });
//       }
//     }

//     // Build payload untuk GenieACS
//     const genieParams = buildGenieParams(parameters);
//     const payload = {
//       name: "setParameterValues",
//       parameterValues: Object.entries(genieParams).map(([name, value]) => {
//         let type = "xsd:string";
//         if (typeof value === "boolean") type = "xsd:boolean";
//         if (typeof value === "number") type = "xsd:int";
//         return { name, value, type };
//       }),
//     };

//     const headers = { "Content-Type": "application/json" };
//     if (username && password) {
//       headers.Authorization = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
//     }

//     const url = `http://${host}:${port}/devices/${encodeURIComponent(device_id)}/tasks`;

//     const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });

//     if (!res.ok) {
//       const errText = await res.text();
//       return NextResponse.json({ success: false, message: "Failed to update DHCP configuration", error: errText }, { status: 500 });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "DHCP server configuration updated successfully",
//       task_status: "queued",
//       parameters_updated: Object.keys(genieParams).length,
//       dhcp_enabled: parameters.DHCPServerEnable ?? null,
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ success: false, message: "Internal server error", error: err.message }, { status: 500 });
//   }
// }
