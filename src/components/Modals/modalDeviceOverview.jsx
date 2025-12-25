"use client";

import Modal from "./modal";

export default function DeviceOverviewModal({
  open,
  onClose,
  device,
}) {
  if (!device) return null;
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Device Overview"
      size="xl"
    >
      <div className="space-y-6 text-sm">

        {/* ===== TOP GRID ===== */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* ===== BASIC INFORMATION ===== */}
          <div className="rounded border border-stroke p-4 dark:border-dark-3">
            <h4 className="mb-3 font-semibold">ⓘ Basic Information</h4>

            <InfoRow label="Device ID" value={device.device_id} />
            <InfoRow label="Serial Number" value={device.serial_number} />
            <InfoRow label="MAC Address" value={device.mac_address} />
            <InfoRow label="Last Inform" value={device.last_inform} />

            <InfoRow
              label="Status"
              value={
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    device.status === "online"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {device.status}
                </span>
              }
            />

            <InfoRow label="Manufacturer" value={device.manufacturer} />
            <InfoRow label="Product Class" value={device.product_class} />
            <InfoRow label="OUI" value={device.oui} />
          </div>

          {/* ===== HARDWARE / SOFTWARE ===== */}
          <div className="space-y-4">
            <div className="rounded border border-stroke p-4 dark:border-dark-3">
              <h4 className="mb-3 font-semibold">⚙ Hardware / Software</h4>

              <InfoRow label="Hardware Version" value={device.hardware_version} />
              <InfoRow label="Software Version" value={device.software_version} />
              <InfoRow label="Uptime (sec)" value={device.uptime} />
            </div>

            {/* ===== OPTICAL ===== */}
            <div className="rounded border border-stroke p-4 dark:border-dark-3">
              <h4 className="mb-3 font-semibold">◎ Optical Information</h4>

              <InfoRow label="RX Power" value={`${device.rx_power} dBm`} />
              <InfoRow label="Temperature" value={`${device.temperature} °C`} />
            </div>
          </div>
        </div>

        {/* ===== NETWORK INFORMATION ===== */}
        <div className="rounded border border-stroke p-4 dark:border-dark-3">
          <h4 className="mb-3 font-semibold">🖧 Network Information</h4>

          <InfoRow
            label="IP TR069"
            value={
              device.ip_tr069 ? (
                <a
                  href={device.ip_tr069}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {device.ip_tr069}
                </a>
              ) : (
                "-"
              )
            }
          />

          <InfoRow label="IP Address" value={device.ip_address} />

          <InfoRow label="WiFi SSID" value={device.wifi_ssid} />
          <InfoRow label="WiFi Password" value="********" />
        </div>

        {/* ===== DHCP SERVER ===== */}
        <div className="rounded border border-stroke p-4 dark:border-dark-3">
          <h4 className="mb-3 font-semibold">📡 DHCP Server</h4>

          <InfoRow
            label="Enabled"
            value={device.dhcp_server?.enabled ? "Yes" : "No"}
          />
          <InfoRow
            label="Configurable"
            value={device.dhcp_server?.configurable ? "Yes" : "No"}
          />
          <InfoRow
            label="IP Range"
            value={
              device.dhcp_server
                ? `${device.dhcp_server.min_address} - ${device.dhcp_server.max_address}`
                : "-"
            }
          />
          <InfoRow
            label="Subnet Mask"
            value={device.dhcp_server?.subnet_mask}
          />
          <InfoRow
            label="Gateway"
            value={device.dhcp_server?.gateway}
          />
          <InfoRow
            label="DNS Servers"
            value={device.dhcp_server?.dns_servers}
          />
          <InfoRow
            label="Lease Time (sec)"
            value={device.dhcp_server?.lease_time}
          />
        </div>

        {/* ===== ADMIN WEB ACCESS ===== */}
        <div className="rounded border border-stroke p-4 dark:border-dark-3">
          <h4 className="mb-3 font-semibold">🔐 Admin Web Access</h4>

          <InfoRow label="Admin User" value={device.admin_user} />
          <InfoRow label="Admin Password" value={device.admin_password} />
          <InfoRow label="Telecom Password" value={device.telecom_password} />
        </div>

      </div>
    </Modal>
  );
}

/* ===== HELPER ROW ===== */
function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b py-1 last:border-none">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 font-medium">
        {value === null || value === undefined ? "-" : value}
      </div>
    </div>
  );
}
