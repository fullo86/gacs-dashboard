export function parseDeviceDataFast(device) {
  const data = {};

  // Device ID
  data.device_id = device._id ?? 'N/A';

  // Serial Number
  data.serial_number =
    device._deviceId?._SerialNumber ??
    device.InternetGatewayDevice?.DeviceInfo?.SerialNumber?._value ??
    'N/A';

  // MAC Address
  let macAddress =
    device.InternetGatewayDevice?.LANDevice?.['1']?.LANEthernetInterfaceConfig?.['1']?.MACAddress?._value ??
    device.InternetGatewayDevice?.WANDevice?.['1']?.WANConnectionDevice?.['1']?.WANIPConnection?.['1']?.MACAddress?._value ??
    device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['1']?.BSSID?._value ??
    device._deviceId?._MACAddress ??
    null;

  if (!macAddress) {
    const oui = device._deviceId?._OUI;
    const serial = device._deviceId?._SerialNumber;
    if (oui && serial && serial.length >= 6) {
      const lastSix = serial.slice(-6);
      if (/^[0-9A-Fa-f]{6}$/.test(lastSix)) {
        const ouiFormatted = `${oui.slice(0, 2)}:${oui.slice(2, 4)}:${oui.slice(4, 6)}`.toUpperCase();
        macAddress = `${ouiFormatted}:${lastSix.slice(0, 2).toUpperCase()}:${lastSix.slice(2, 4).toUpperCase()}:${lastSix.slice(4, 6).toUpperCase()}`;
      }
    }
  }
  data.mac_address = macAddress ?? 'N/A';

  // Basic device info
  data.manufacturer = device._deviceId?._Manufacturer ?? 'N/A';
  data.oui = device._deviceId?._OUI ?? 'N/A';
  data.product_class = device._deviceId?._ProductClass ?? 'N/A';
  data.hardware_version = device.InternetGatewayDevice?.DeviceInfo?.HardwareVersion?._value ?? 'N/A';
  data.software_version = device.InternetGatewayDevice?.DeviceInfo?.SoftwareVersion?._value ?? 'N/A';

  // Status & last inform
  const lastInform = device._lastInform;
  let lastInformTimestamp = null;
  if (lastInform) {
    lastInformTimestamp = Date.parse(lastInform);
    if (!isNaN(lastInformTimestamp)) {
      data.last_inform = new Date(lastInformTimestamp).toISOString();
      data.status = (Date.now() - lastInformTimestamp) < 300_000 ? 'online' : 'offline'; // 5 menit
    } else {
      data.last_inform = 'N/A';
      data.status = 'offline';
    }
  } else {
    data.last_inform = 'N/A';
    data.status = 'offline';
  }

  // Ping estimation
  if (data.status === 'online' && lastInformTimestamp) {
    const diffSec = (Date.now() - lastInformTimestamp) / 1000;
    if (diffSec < 30) data.ping = randomInt(1, 5);
    else if (diffSec < 60) data.ping = randomInt(5, 15);
    else if (diffSec < 120) data.ping = randomInt(15, 50);
    else data.ping = randomInt(50, 200);
  } else {
    data.ping = null;
  }

  // IP TR-069
  const connectionUrl =
    device.InternetGatewayDevice?.ManagementServer?.ConnectionRequestURL?._value ??
    device.Device?.ManagementServer?.ConnectionRequestURL?._value ??
    null;
  data.ip_tr069 = connectionUrl ?? 'N/A';

  let ipAddress = 'N/A';
  if (connectionUrl && connectionUrl !== 'N/A') {
    const match = connectionUrl.match(/https?:\/\/([^:\/]+)/);
    if (match) ipAddress = match[1];
  }

  if (ipAddress === 'N/A') {
    ipAddress =
      device.InternetGatewayDevice?.WANDevice?.['1']?.WANConnectionDevice?.['1']?.WANIPConnection?.['1']?.ExternalIPAddress?._value ??
      device.InternetGatewayDevice?.WANDevice?.['1']?.WANConnectionDevice?.['1']?.WANPPPConnection?.['1']?.ExternalIPAddress?._value ??
      'N/A';
  }
  data.ip_address = ipAddress;

  // Uptime
  data.uptime =
    device.InternetGatewayDevice?.DeviceInfo?.UpTime?._value ??
    device.Device?.DeviceInfo?.UpTime?._value ??
    0;

  // WiFi SSID
  data.wifi_ssid =
    device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['1']?.SSID?._value ??
    device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['2']?.SSID?._value ??
    'N/A';

  // WiFi Password
  data.wifi_password =
    device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['1']?.KeyPassphrase?._value ??
    device.InternetGatewayDevice?.LANDevice?.['1']?.WLANConfiguration?.['1']?.PreSharedKey?.['1']?.KeyPassphrase?._value ??
    'N/A';

  // RX Power
  let rxPower =
    device.VirtualParameters?.RXPower?._value ??
    device.InternetGatewayDevice?.WANDevice?.['1']?.['X_CT-COM_EponInterfaceConfig']?.RXPower?._value ??
    device.Device?.Optical?.Interface?.['1']?.RxPower?._value ??
    null;
  if (rxPower !== null && !isNaN(rxPower)) {
    rxPower = parseFloat(rxPower);
    if (rxPower > 100) rxPower = (rxPower / 100) - 40;
    data.rx_power = rxPower.toFixed(2);
  } else data.rx_power = 'N/A';

  // Temperature
  let temperature =
    device.VirtualParameters?.gettemp?._value ??
    device.InternetGatewayDevice?.WANDevice?.['1']?.['X_CT-COM_EponInterfaceConfig']?.TransceiverTemperature?._value ??
    device.VirtualParameters?.Temperature?._value ??
    device.InternetGatewayDevice?.DeviceInfo?.Temperature?._value ??
    null;
  if (temperature !== null && !isNaN(temperature)) {
    temperature = parseFloat(temperature);
    if (temperature > 1000) temperature = temperature / 256;
    data.temperature = temperature.toFixed(1);
  } else data.temperature = 'N/A';

  // PPPoE Username
  let pppoeUsername = 'N/A';
  for (let i = 1; i <= 8; i++) {
    const username = device.InternetGatewayDevice?.WANDevice?.['1']?.WANConnectionDevice?.[i]?.WANPPPConnection?.['1']?.Username?._value;
    if (username) {
      pppoeUsername = username;
      break;
    }
  }
  data.pppoe_username = pppoeUsername;

  // Connected devices count
  let connectedDevices = 0;
  const hosts = device.InternetGatewayDevice?.LANDevice?.['1']?.Hosts?.Host;
  if (hosts) {
    const deviceTime = lastInformTimestamp;
    for (const [hostId, hostData] of Object.entries(hosts)) {
      if (hostId.startsWith('_')) continue;
      const ip = hostData.IPAddress?._value;
      const mac = hostData.MACAddress?._value;
      const ts = hostData._timestamp;
      let active = true;
      if (ts && deviceTime) {
        const hostTs = Date.parse(ts);
        if (!isNaN(hostTs)) {
          const threeHBefore = deviceTime - 3 * 3600 * 1000;
          const threeHAfter = deviceTime + 3 * 3600 * 1000;
          active = hostTs >= threeHBefore && hostTs <= threeHAfter;
        }
      }
      if (ip && mac && active) connectedDevices++;
    }
  }
  data.connected_devices_count = connectedDevices;

  // Tags
  data.tags = Array.isArray(device._tags) ? device._tags : [];

  return data;
}

// Helper function
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
