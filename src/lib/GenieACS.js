import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import axios from 'axios';
import { getMACVendor } from './helper';

async function getCredentialByUser(userId) {
  return await GenieacsCredential.findOne({ where: { user_id: userId } });
}

async function genieacsRequest(userId, endpoint, method = 'GET', data = null) {
  const credential = await getCredentialByUser(userId);
  if (!credential) throw new Error('Credential not found');

  const url = `http://${credential.host}:${credential.port}${endpoint}`;

  const config = {
    url,
    method,
    timeout: 300000,
  };

  if (data) {
    config.data = data;
  }

  if (credential.username && credential.password) {
    config.auth = {
      username: credential.username,
      password: credential.password,
    };
  }

  try {
    const response = await axios(config);

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
}

export async function testConnection(userId) {
  return await genieacsRequest(userId, '/devices?limit=1');
}

export async function getDevices(userId, query = {}, limit = 0, skip = 0) {
  let params = [];
  if (Object.keys(query).length > 0) params.push('query=' + encodeURIComponent(JSON.stringify(query)));
  if (limit > 0) params.push('limit=' + limit);
  if (skip > 0) params.push('skip=' + skip);
  const queryString = params.length ? '?' + params.join('&') : '';
  return await genieacsRequest(userId, '/devices/' + queryString);
}

export async function getDevice(userId, deviceId) {
  const query = { _id: deviceId };
  const endpoint = '/devices/?query=' + encodeURIComponent(JSON.stringify(query));
  return await genieacsRequest(userId, endpoint);
}

export async function executeTask(userId, deviceId, taskName, params = {}) {
  const endpoint = `/devices/${encodeURIComponent(deviceId)}/tasks`;
  const data = { name: taskName };
  if (Object.keys(params).length > 0) data.parameterValues = params;
  return await genieacsRequest(userId, endpoint, 'POST', data);
}

export async function summonDevice(userId, deviceId) {
  const endpoint = `/devices/${encodeURIComponent(deviceId)}/tasks?connection_request`;
  return await genieacsRequest(userId, endpoint, 'POST');
}

export async function refreshInform(userId, deviceId) {
  return await summonDevice(userId, deviceId);
}

export async function addRefreshTask(userId, deviceId, parameterPath) {
  const endpoint = `/devices/${encodeURIComponent(deviceId)}/tasks?timeout=3000&connection_request`;
  const data = {
    name: 'refreshObject',
    objectName: parameterPath
  };
  return await genieacsRequest(userId, endpoint, 'POST', data);
}

export async function getDeviceCount(userId, query = {}) {
  const queryString =
    Object.keys(query).length === 0
      ? ""
      : `?query=${encodeURIComponent(JSON.stringify(query))}`;

  const endpoint = `/devices/${queryString}`;
  const result = await genieacsRequest(userId, endpoint, "GET");

  if (result?.success && Array.isArray(result?.data)) {
    return { success: true, devices: result.data.length };
  }
  return { success: false, devices: 0 };
}


/**
 * Get device statistics
 */
export async function getDeviceStats(userId) {
  const devices = await getDevices(userId);
  if (!devices.success) {
    return { success: false, error: "Failed to fetch devices" };
  }

  let total = devices.data.length;
  let online = 0;
  let offline = 0;

  const now = Date.now();

  for (const device of devices.data) {
    const lastInform = device?._lastInform;

    let isOnline = false;

    if (lastInform) {
      const lastInformTime = Date.parse(lastInform); // ISO 8601 → timestamp (ms)
      if (!isNaN(lastInformTime)) {
        isOnline = now - lastInformTime < 5 * 60 * 1000;
      }
    }

    if (isOnline) {
      online++;
    } else {
      offline++;
    }
  }

  return { success: true, data: { total, online, offline }  };
}

export function parseDeviceData(device) {
  const data = {};

  /* =====================================================
   * Helper: getParam (GenieACS _value aware)
   * ===================================================== */
  const getParam = (path) => {
    if (!device || !path) return null;
    const keys = path.split(".");
    let value = device;

    for (const key of keys) {
      if (value && Object.prototype.hasOwnProperty.call(value, key)) {
        value = value[key];
      } else {
        return null;
      }
    }

    if (typeof value === "object" && value !== null && "_value" in value) {
      return value._value;
    }

    return typeof value === "object" ? null : value;
  };

  /* =====================================================
   * Helper: check WAN exists
   * ===================================================== */
  const checkWANExists = (path) => {
    const keys = path.split(".");
    let value = device;

    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key];
      } else {
        return false;
      }
    }

    if (typeof value === "object" && value !== null) {
      return (
        value._object === true ||
        value.ConnectionStatus !== undefined ||
        value.Enable !== undefined ||
        value.Name !== undefined
      );
    }
    return false;
  };

  /* =====================================================
   * Helper: detect active WLAN / LAN
   * ===================================================== */
  const detectActiveInterfaces = () => {
    const active = [];

    // WLAN 1–4
    for (let i = 1; i <= 4; i++) {
      const base = `InternetGatewayDevice.LANDevice.1.WLANConfiguration.${i}`;
      const enable = getParam(`${base}.Enable`);
      const status = getParam(`${base}.Status`);
      const ssid = getParam(`${base}.SSID`);
      const vlan = getParam(`${base}.X_CT-COM_VLAN`);

      if ((enable === true || status === "Up") && ssid) {
        active.push({
          type: "WLAN",
          number: i,
          interface: base,
          ssid,
          vlan: vlan ?? "N/A",
        });
      }
    }

    // LAN Ethernet 1–4
    for (let i = 1; i <= 4; i++) {
      const base = `InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.${i}`;
      const enable = getParam(`${base}.Enable`);
      const status = getParam(`${base}.Status`);
      const vlan = getParam(`${base}.X_CT-COM_VLAN`);

      if (enable === true || (status && status !== "NoLink")) {
        active.push({
          type: "LAN Ethernet",
          number: i,
          interface: base,
          vlan: vlan ?? "N/A",
        });
      }
    }

    return active;
  };

  /* =====================================================
   * Basic Info
   * ===================================================== */
  data.device_id = device?._id ?? "N/A";

  data.serial_number =
    getParam("_deviceId._SerialNumber") ||
    getParam("InternetGatewayDevice.DeviceInfo.SerialNumber") ||
    "N/A";

  let macAddress =
    getParam("InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.MACAddress") ||
    getParam("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.MACAddress") ||
    getParam("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.BSSID") ||
    getParam("Device.Ethernet.Interface.1.MACAddress") ||
    getParam("_deviceId._MACAddress");

  if (!macAddress) {
    const oui = getParam("_deviceId._OUI");
    const serial = getParam("_deviceId._SerialNumber");
    if (oui && serial && serial.length >= 6) {
      const lastSix = serial.slice(-6);
      if (/^[0-9a-fA-F]{6}$/.test(lastSix)) {
        const ouiFmt = `${oui.slice(0, 2)}:${oui.slice(2, 4)}:${oui.slice(4, 6)}`.toUpperCase();
        macAddress = `${ouiFmt}:${lastSix.match(/.{1,2}/g).join(":")}`.toUpperCase();
      }
    }
  }

  data.mac_address = macAddress ?? "N/A";
  data.manufacturer =
    getParam("_deviceId._Manufacturer") ||
    getParam("InternetGatewayDevice.DeviceInfo.Manufacturer") ||
    "N/A";

  data.oui =
    getParam("_deviceId._OUI") ||
    getParam("InternetGatewayDevice.DeviceInfo.ManufacturerOUI") ||
    "N/A";

  data.product_class =
    getParam("_deviceId._ProductClass") ||
    getParam("InternetGatewayDevice.DeviceInfo.ProductClass") ||
    "N/A";

  data.hardware_version = getParam("InternetGatewayDevice.DeviceInfo.HardwareVersion") ?? "N/A";
  data.software_version = getParam("InternetGatewayDevice.DeviceInfo.SoftwareVersion") ?? "N/A";

  /* =====================================================
   * Status & Ping
   * ===================================================== */
  let lastInformTS = null;

  if (device?._lastInform) {
    const ts = Date.parse(device._lastInform);
    if (!isNaN(ts)) {
      lastInformTS = ts;
      data.last_inform = new Date(ts).toISOString().replace("T", " ").slice(0, 19);
      data.status = Date.now() - ts < 300000 ? "online" : "offline";
    } else {
      data.last_inform = "N/A";
      data.status = "offline";
    }
  } else {
    data.last_inform = "N/A";
    data.status = "offline";
  }

  const ping =
    getParam("VirtualParameters.Ping") ||
    getParam("VirtualParameters.ping") ||
    getParam("VirtualParameters.PingResult");

  if (data.status === "online") {
    if (ping !== null && !isNaN(ping)) {
      data.ping = Number(ping);
    } else if (lastInformTS) {
      const d = (Date.now() - lastInformTS) / 1000;
      data.ping = d < 30 ? 5 : d < 60 ? 15 : d < 120 ? 50 : 150;
    }
  } else {
    data.ping = null;
  }

  /* =====================================================
   * IP / Uptime
   * ===================================================== */
  const connUrl =
    getParam("InternetGatewayDevice.ManagementServer.ConnectionRequestURL") ||
    getParam("Device.ManagementServer.ConnectionRequestURL");

  data.ip_tr069 = connUrl ?? "N/A";

  let ip =
    connUrl?.match(/https?:\/\/([^:/]+)/)?.[1] ||
    getParam("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress") ||
    getParam("Device.IP.Interface.1.IPv4Address.1.IPAddress") ||
    "N/A";

  data.ip_address = ip;
  data.uptime =
    getParam("InternetGatewayDevice.DeviceInfo.UpTime") ||
    getParam("Device.DeviceInfo.UpTime") ||
    "N/A";

  /* =====================================================
   * WiFi
   * ===================================================== */
  data.wifi_ssid =
    getParam("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID") ||
    getParam("InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID") ||
    getParam("Device.WiFi.SSID.1.SSID") ||
    "N/A";

  data.wifi_password =
    getParam("InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase") ||
    getParam("Device.WiFi.AccessPoint.1.Security.KeyPassphrase") ||
    "N/A";

  /* =====================================================
   * Optical & Temperature
   * ===================================================== */
  let rx = getParam("VirtualParameters.RXPower") || getParam("Device.Optical.Interface.1.RxPower");
  data.rx_power = !isNaN(rx) ? (rx > 100 ? (rx / 100 - 40).toFixed(2) : Number(rx).toFixed(2)) : rx ?? "N/A";

  let temp = getParam("VirtualParameters.gettemp") || getParam("VirtualParameters.Temperature");
  data.temperature = !isNaN(temp) ? (temp > 1000 ? (temp / 256).toFixed(1) : Number(temp).toFixed(1)) : temp ?? "N/A";

  /* =====================================================
   * WAN PPPoE & IP
   * ===================================================== */
  const wan_details = [];

  for (let i = 1; i <= 8; i++) {
    const bases = [
      { path: `InternetGatewayDevice.WANDevice.1.WANConnectionDevice.${i}.WANPPPConnection.1`, type: "PPPoE" },
      { path: `InternetGatewayDevice.WANDevice.1.WANConnectionDevice.${i}.WANIPConnection.1`, type: "IP" },
    ];

    for (const { path, type } of bases) {
      if (!checkWANExists(path)) continue;

      const lanIface = getParam(`${path}.X_CT-COM_LanInterface`);
      let binding = "N/A";

      if (lanIface) {
        if (/WLANConfiguration\.(\d+)/.test(lanIface)) binding = `WLAN ${RegExp.$1}`;
        else if (/LANEthernetInterfaceConfig\.(\d+)/.test(lanIface)) binding = `LAN Ethernet ${RegExp.$1}`;
        else binding = lanIface;
      }

      wan_details.push({
        type,
        name: getParam(`${path}.Name`) || `WAN_${type}_${i}`,
        status: getParam(`${path}.ConnectionStatus`) ?? "Unknown",
        connection_type: getParam(`${path}.ConnectionType`) ?? "N/A",
        external_ip: getParam(`${path}.ExternalIPAddress`) ?? "N/A",
        gateway: getParam(`${path}.DefaultGateway`) ?? "N/A",
        subnet_mask: getParam(`${path}.SubnetMask`) ?? "N/A",
        dns_servers: getParam(`${path}.DNSServers`) ?? "N/A",
        mac_address: getParam(`${path}.MACAddress`) ?? "N/A",
        username: type === "PPPoE" ? getParam(`${path}.Username`) ?? "N/A" : "N/A",
        uptime: getParam(`${path}.Uptime`) ?? "N/A",
        binding,
      });
    }
  }

  data.wan_details = wan_details;
  data.pppoe_username = wan_details.find(w => w.type === "PPPoE" && w.username && w.username !== "N/A")?.username ?? "N/A";

  /* =====================================================
   * Connected Devices
   * ===================================================== */
  const hosts = device?.InternetGatewayDevice?.LANDevice?.["1"]?.Hosts?.Host;
  const connected = [];

  if (hosts) {
    for (const k in hosts) {
      if (k.startsWith("_")) continue;
      const h = hosts[k];
      if (h?.IPAddress?._value && h?.MACAddress?._value) {
        connected.push({
          hostname: h?.HostName?._value || "Unknown Device",
          vendor: getMACVendor(h.MACAddress._value),
          ip_address: h.IPAddress._value,
          mac_address: h.MACAddress._value,
          interface_type: h?.InterfaceType?._value === "802.11" ? "WiFi" : "Ethernet",
          active: h?.Active?._value ?? true,
        });
      }
    }
  }

  data.connected_devices = connected;
  data.connected_devices_count = connected.length;

  /* =====================================================
   * DHCP Server
   * ===================================================== */
  const dhcpBase = "InternetGatewayDevice.LANDevice.1.LANHostConfigManagement";
  const dhcpEnabled = getParam(`${dhcpBase}.DHCPServerEnable`);
  const dhcpLease = getParam(`${dhcpBase}.DHCPLeaseTime`);

  data.dhcp_server =
    dhcpEnabled !== null || dhcpLease !== null
      ? {
          enabled: dhcpEnabled ?? false,
          configurable: getParam(`${dhcpBase}.DHCPServerConfigurable`) ?? true,
          min_address: getParam(`${dhcpBase}.MinAddress`) ?? "N/A",
          max_address: getParam(`${dhcpBase}.MaxAddress`) ?? "N/A",
          subnet_mask: getParam(`${dhcpBase}.SubnetMask`) ?? "N/A",
          gateway: getParam(`${dhcpBase}.IPRouters`) ?? "N/A",
          dns_servers: getParam(`${dhcpBase}.DNSServers`) ?? "N/A",
          lease_time: dhcpLease ?? 86400,
        }
      : null;

  /* =====================================================
   * Admin Credentials
   * ===================================================== */
  data.admin_user = getParam("VirtualParameters.superAdmin") ?? "N/A";
  data.admin_password = getParam("VirtualParameters.superPassword") ?? "N/A";
  data.telecom_password =
    getParam("InternetGatewayDevice.DeviceInfo.X_CT-COM_TeleComAccount.Password") ?? "N/A";

  data.tags = device?._tags ?? [];

  return data;
}

// export function parseDeviceData(device) {
//   const data = {}

//   const getParam = (path) => {
//     const keys = path.split('.')
//     let value = device

//     for (const key of keys) {
//       if (value && value[key] !== undefined) {
//         value = value[key]
//       } else {
//         return null
//       }
//     }

//     if (value && typeof value === 'object' && '_value' in value) {
//       return value._value
//     }

//     return typeof value === 'object' ? null : value
//   }

//   /* =========================
//      BASIC INFO
//   ========================== */
//   data.device_id = device._id ?? 'N/A'
//   data.serial_number =
//     getParam('_deviceId._SerialNumber') ||
//     getParam('InternetGatewayDevice.DeviceInfo.SerialNumber') ||
//     'N/A'

//   /* =========================
//      MAC ADDRESS
//   ========================== */
//   let macAddress =
//     getParam('InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.MACAddress') ||
//     getParam('InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.MACAddress') ||
//     getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.BSSID') ||
//     getParam('Device.Ethernet.Interface.1.MACAddress') ||
//     getParam('_deviceId._MACAddress')

//   // Fallback MAC dari OUI + Serial
//   if (!macAddress || macAddress === 'N/A') {
//     const oui = getParam('_deviceId._OUI')
//     const serial = getParam('_deviceId._SerialNumber')

//     if (oui && serial && serial.length >= 6) {
//       const lastSix = serial.slice(-6)
//       if (/^[0-9A-Fa-f]{6}$/.test(lastSix)) {
//         const ouiFmt = `${oui.slice(0,2)}:${oui.slice(2,4)}:${oui.slice(4,6)}`.toUpperCase()
//         macAddress = `${ouiFmt}:${lastSix.slice(0,2)}:${lastSix.slice(2,4)}:${lastSix.slice(4,6)}`.toUpperCase()
//       }
//     }
//   }

//   data.mac_address = macAddress ?? 'N/A'

//   data.manufacturer =
//     getParam('_deviceId._Manufacturer') ||
//     getParam('InternetGatewayDevice.DeviceInfo.Manufacturer') ||
//     'N/A'

//   data.oui =
//     getParam('_deviceId._OUI') ||
//     getParam('InternetGatewayDevice.DeviceInfo.ManufacturerOUI') ||
//     'N/A'

//   data.product_class =
//     getParam('_deviceId._ProductClass') ||
//     getParam('InternetGatewayDevice.DeviceInfo.ProductClass') ||
//     'N/A'

//   data.hardware_version =
//     getParam('InternetGatewayDevice.DeviceInfo.HardwareVersion') || 'N/A'

//   data.software_version =
//     getParam('InternetGatewayDevice.DeviceInfo.SoftwareVersion') || 'N/A'

//   /* =========================
//      STATUS & LAST INFORM
//   ========================== */
//   const lastInform = device._lastInform
//   let lastInformTs = null

//   if (lastInform) {
//     lastInformTs = Date.parse(lastInform)
//     if (!isNaN(lastInformTs)) {
//       data.last_inform = new Date(lastInformTs).toISOString().replace('T',' ').slice(0,19)
//       data.status = Date.now() - lastInformTs < 300000 ? 'online' : 'offline'
//     } else {
//       data.last_inform = 'N/A'
//       data.status = 'offline'
//     }
//   } else {
//     data.last_inform = 'N/A'
//     data.status = 'offline'
//   }

//   /* =========================
//      PING
//   ========================== */
//   const ping =
//     getParam('VirtualParameters.Ping') ||
//     getParam('VirtualParameters.ping') ||
//     getParam('VirtualParameters.PingResult')

//   if (data.status === 'online') {
//     if (ping !== null && !isNaN(ping)) {
//       data.ping = parseInt(ping)
//     } else if (lastInformTs) {
//       const diff = (Date.now() - lastInformTs) / 1000
//       data.ping =
//         diff < 30 ? rand(1,5) :
//         diff < 60 ? rand(5,15) :
//         diff < 120 ? rand(15,50) :
//         rand(50,200)
//     } else {
//       data.ping = null
//     }
//   } else {
//     data.ping = null
//   }

//   /* =========================
//      IP & NETWORK
//   ========================== */
//   const connUrl =
//     getParam('InternetGatewayDevice.ManagementServer.ConnectionRequestURL') ||
//     getParam('Device.ManagementServer.ConnectionRequestURL')

//   data.ip_tr069 = connUrl ?? 'N/A'

//   let ipAddress = 'N/A'
//   if (connUrl) {
//     const m = connUrl.match(/https?:\/\/([^:/]+)/)
//     if (m) ipAddress = m[1]
//   }

//   if (ipAddress === 'N/A') {
//     ipAddress =
//       getParam('InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress') ||
//       getParam('Device.IP.Interface.1.IPv4Address.1.IPAddress') ||
//       'N/A'
//   }

//   data.ip_address = ipAddress

//   data.uptime =
//     getParam('InternetGatewayDevice.DeviceInfo.UpTime') ||
//     getParam('Device.DeviceInfo.UpTime') ||
//     'N/A'

//   /* =========================
//      WIFI
//   ========================== */
//   data.wifi_ssid =
//     getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID') ||
//     getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID') ||
//     getParam('Device.WiFi.SSID.1.SSID') ||
//     'N/A'

//   data.wifi_password =
//     getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase') ||
//     getParam('Device.WiFi.AccessPoint.1.Security.KeyPassphrase') ||
//     'N/A'

//   /* =========================
//      OPTICAL RX POWER
//   ========================== */
//   let rxPower =
//     getParam('VirtualParameters.RXPower') ||
//     getParam('InternetGatewayDevice.WANDevice.1.X_CT-COM_EponInterfaceConfig.RXPower') ||
//     getParam('Device.Optical.Interface.1.RxPower')

//   if (rxPower !== null && !isNaN(rxPower)) {
//     rxPower = Number(rxPower)
//     if (rxPower > 100) rxPower = rxPower / 100 - 40
//     data.rx_power = rxPower.toFixed(2)
//   } else {
//     data.rx_power = rxPower ?? 'N/A'
//   }

//   /* =========================
//      TEMPERATURE
//   ========================== */
//   let temp =
//     getParam('VirtualParameters.gettemp') ||
//     getParam('InternetGatewayDevice.WANDevice.1.X_CT-COM_EponInterfaceConfig.TransceiverTemperature') ||
//     getParam('VirtualParameters.Temperature') ||
//     getParam('InternetGatewayDevice.DeviceInfo.Temperature')

//   if (temp !== null && !isNaN(temp)) {
//     temp = Number(temp)
//     if (temp > 1000) temp = temp / 256
//     data.temperature = temp.toFixed(1)
//   } else {
//     data.temperature = temp ?? 'N/A'
//   }

//   /* =========================
//      DHCP SERVER
//   ========================== */
//   const dhcpServer = {};
//   const dhcpBase = 'InternetGatewayDevice.LANDevice.1.LANHostConfigManagement';

//   // Check multiple DHCP parameters to determine if device supports DHCP
//   const dhcpEnabled = getParam(`${dhcpBase}.DHCPServerEnable`);
//   const dhcpLeaseTime = getParam(`${dhcpBase}.DHCPLeaseTime`);

//   // Device has DHCP capability if any DHCP parameter is present
//   const hasDhcpCapability = dhcpEnabled !== null || dhcpLeaseTime !== null;

//   if (hasDhcpCapability) {
//     // Extract DHCP parameters (use false/N/A as defaults if not configured)
//     dhcpServer.enabled = dhcpEnabled ?? false;
//     dhcpServer.configurable = getParam(`${dhcpBase}.DHCPServerConfigurable`) ?? true;
//     dhcpServer.min_address = getParam(`${dhcpBase}.MinAddress`) ?? 'N/A';
//     dhcpServer.max_address = getParam(`${dhcpBase}.MaxAddress`) ?? 'N/A';
//     dhcpServer.subnet_mask = getParam(`${dhcpBase}.SubnetMask`) ?? 'N/A';
//     dhcpServer.gateway = getParam(`${dhcpBase}.IPRouters`) ?? 'N/A';
//     dhcpServer.dns_servers = getParam(`${dhcpBase}.DNSServers`) ?? 'N/A';
//     dhcpServer.lease_time = dhcpLeaseTime ?? 86400; // Default to 24 hours

//     data.dhcp_server = dhcpServer;
//   } else {
//     // Device does not support DHCP - set to null
//     data.dhcp_server = null;
//   }

//   /* =========================
//      ADMIN ACCESS (ALWAYS PRESENT)
//   ========================== */
//   data.admin_user =
//     getParam(device, 'VirtualParameters.superAdmin') || 'N/A'

//   data.admin_password =
//     getParam(device, 'VirtualParameters.superPassword') || 'N/A'

//   data.telecom_password =
//     getParam(device, 'InternetGatewayDevice.DeviceInfo.X_CT-COM_TeleComAccount.Password') ||
//     'N/A'

//   /* =========================
//      TAGS
//   ========================== */
//   data.tags = device._tags ?? []

//   return data
// }

/* =========================
   UTIL
========================== */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
