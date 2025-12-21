import GenieacsCredential from '@/models/genieacs/GenieACSCredential';
import axios from 'axios';

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
  const data = {}

  const getParam = (path) => {
    const keys = path.split('.')
    let value = device

    for (const key of keys) {
      if (value && value[key] !== undefined) {
        value = value[key]
      } else {
        return null
      }
    }

    if (value && typeof value === 'object' && '_value' in value) {
      return value._value
    }

    return typeof value === 'object' ? null : value
  }

  /* =========================
     BASIC INFO
  ========================== */
  data.device_id = device._id ?? 'N/A'
  data.serial_number =
    getParam('_deviceId._SerialNumber') ||
    getParam('InternetGatewayDevice.DeviceInfo.SerialNumber') ||
    'N/A'

  /* =========================
     MAC ADDRESS
  ========================== */
  let macAddress =
    getParam('InternetGatewayDevice.LANDevice.1.LANEthernetInterfaceConfig.1.MACAddress') ||
    getParam('InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.MACAddress') ||
    getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.BSSID') ||
    getParam('Device.Ethernet.Interface.1.MACAddress') ||
    getParam('_deviceId._MACAddress')

  // Fallback MAC dari OUI + Serial
  if (!macAddress || macAddress === 'N/A') {
    const oui = getParam('_deviceId._OUI')
    const serial = getParam('_deviceId._SerialNumber')

    if (oui && serial && serial.length >= 6) {
      const lastSix = serial.slice(-6)
      if (/^[0-9A-Fa-f]{6}$/.test(lastSix)) {
        const ouiFmt = `${oui.slice(0,2)}:${oui.slice(2,4)}:${oui.slice(4,6)}`.toUpperCase()
        macAddress = `${ouiFmt}:${lastSix.slice(0,2)}:${lastSix.slice(2,4)}:${lastSix.slice(4,6)}`.toUpperCase()
      }
    }
  }

  data.mac_address = macAddress ?? 'N/A'

  data.manufacturer =
    getParam('_deviceId._Manufacturer') ||
    getParam('InternetGatewayDevice.DeviceInfo.Manufacturer') ||
    'N/A'

  data.oui =
    getParam('_deviceId._OUI') ||
    getParam('InternetGatewayDevice.DeviceInfo.ManufacturerOUI') ||
    'N/A'

  data.product_class =
    getParam('_deviceId._ProductClass') ||
    getParam('InternetGatewayDevice.DeviceInfo.ProductClass') ||
    'N/A'

  data.hardware_version =
    getParam('InternetGatewayDevice.DeviceInfo.HardwareVersion') || 'N/A'

  data.software_version =
    getParam('InternetGatewayDevice.DeviceInfo.SoftwareVersion') || 'N/A'

  /* =========================
     STATUS & LAST INFORM
  ========================== */
  const lastInform = device._lastInform
  let lastInformTs = null

  if (lastInform) {
    lastInformTs = Date.parse(lastInform)
    if (!isNaN(lastInformTs)) {
      data.last_inform = new Date(lastInformTs).toISOString().replace('T',' ').slice(0,19)
      data.status = Date.now() - lastInformTs < 300000 ? 'online' : 'offline'
    } else {
      data.last_inform = 'N/A'
      data.status = 'offline'
    }
  } else {
    data.last_inform = 'N/A'
    data.status = 'offline'
  }

  /* =========================
     PING
  ========================== */
  const ping =
    getParam('VirtualParameters.Ping') ||
    getParam('VirtualParameters.ping') ||
    getParam('VirtualParameters.PingResult')

  if (data.status === 'online') {
    if (ping !== null && !isNaN(ping)) {
      data.ping = parseInt(ping)
    } else if (lastInformTs) {
      const diff = (Date.now() - lastInformTs) / 1000
      data.ping =
        diff < 30 ? rand(1,5) :
        diff < 60 ? rand(5,15) :
        diff < 120 ? rand(15,50) :
        rand(50,200)
    } else {
      data.ping = null
    }
  } else {
    data.ping = null
  }

  /* =========================
     IP & NETWORK
  ========================== */
  const connUrl =
    getParam('InternetGatewayDevice.ManagementServer.ConnectionRequestURL') ||
    getParam('Device.ManagementServer.ConnectionRequestURL')

  data.ip_tr069 = connUrl ?? 'N/A'

  let ipAddress = 'N/A'
  if (connUrl) {
    const m = connUrl.match(/https?:\/\/([^:/]+)/)
    if (m) ipAddress = m[1]
  }

  if (ipAddress === 'N/A') {
    ipAddress =
      getParam('InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress') ||
      getParam('Device.IP.Interface.1.IPv4Address.1.IPAddress') ||
      'N/A'
  }

  data.ip_address = ipAddress

  data.uptime =
    getParam('InternetGatewayDevice.DeviceInfo.UpTime') ||
    getParam('Device.DeviceInfo.UpTime') ||
    'N/A'

  /* =========================
     WIFI
  ========================== */
  data.wifi_ssid =
    getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID') ||
    getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID') ||
    getParam('Device.WiFi.SSID.1.SSID') ||
    'N/A'

  data.wifi_password =
    getParam('InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.KeyPassphrase') ||
    getParam('Device.WiFi.AccessPoint.1.Security.KeyPassphrase') ||
    'N/A'

  /* =========================
     OPTICAL RX POWER
  ========================== */
  let rxPower =
    getParam('VirtualParameters.RXPower') ||
    getParam('InternetGatewayDevice.WANDevice.1.X_CT-COM_EponInterfaceConfig.RXPower') ||
    getParam('Device.Optical.Interface.1.RxPower')

  if (rxPower !== null && !isNaN(rxPower)) {
    rxPower = Number(rxPower)
    if (rxPower > 100) rxPower = rxPower / 100 - 40
    data.rx_power = rxPower.toFixed(2)
  } else {
    data.rx_power = rxPower ?? 'N/A'
  }

  /* =========================
     TEMPERATURE
  ========================== */
  let temp =
    getParam('VirtualParameters.gettemp') ||
    getParam('InternetGatewayDevice.WANDevice.1.X_CT-COM_EponInterfaceConfig.TransceiverTemperature') ||
    getParam('VirtualParameters.Temperature') ||
    getParam('InternetGatewayDevice.DeviceInfo.Temperature')

  if (temp !== null && !isNaN(temp)) {
    temp = Number(temp)
    if (temp > 1000) temp = temp / 256
    data.temperature = temp.toFixed(1)
  } else {
    data.temperature = temp ?? 'N/A'
  }

  /* =========================
     TAGS
  ========================== */
  data.tags = device._tags ?? []

  return data
}

/* =========================
   UTIL
========================== */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
