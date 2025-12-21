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

          {/* Basic Information */}
          <div className="rounded border border-stroke p-4 dark:border-dark-3">
            <h4 className="mb-3 font-semibold">
              ⓘ Basic Information
            </h4>

            <InfoRow label="Device ID" value={device.device_id} />
            <InfoRow label="Serial Number" value={device.serial_number} />
            <InfoRow label="MAC Address" value={device.mac_address} />
            <InfoRow label="Last Inform" value={device.last_inform} />
            <InfoRow
              label="Status"
              value={
                <span className="rounded bg-green-100 px-2 py-0.5 text-green-700">
                  {device.status}
                </span>
              }
            />
            <InfoRow label="Manufacturer" value={device.manufacturer} />
            <InfoRow label="Product Class" value={device.product_class} />
            <InfoRow label="OUI" value={device.oui} />
          </div>

          {/* Hardware / Software */}
          <div className="space-y-4">
            <div className="rounded border border-stroke p-4 dark:border-dark-3">
              <h4 className="mb-3 font-semibold">
                ⚙ Hardware / Software
              </h4>

              <InfoRow label="Hardware Version" value={device.hw_version} />
              <InfoRow label="Software Version" value={device.sw_version} />
              <InfoRow label="Uptime" value={device.uptime} />
            </div>

            {/* Optical Information */}
            <div className="rounded border border-stroke p-4 dark:border-dark-3">
              <h4 className="mb-3 font-semibold">
                ◎ Optical Information
              </h4>

              <InfoRow label="RX Power" value={`${device.rx_power} dBm`} />
              <InfoRow label="Temperature" value={`${device.temperature} °C`} />
            </div>
          </div>
        </div>

        {/* ===== NETWORK INFO ===== */}
        <div className="rounded border border-stroke p-4 dark:border-dark-3">
          <h4 className="mb-3 font-semibold">
            🖧 Network Information
          </h4>

          <InfoRow
            label="IP TR069"
            value={
              <a
                href={`http://${device.ip_tr069}`}
                className="text-primary underline"
              >
                {device.ip_tr069}
              </a>
            }
          />

          <InfoRow
            label="WiFi SSID"
            value={
              <div className="flex items-center gap-2">
                <span>{device.wifi_ssid}</span>
                <button className="rounded bg-yellow-400 px-2 py-1 text-xs font-medium text-black">
                  ✎ Edit WiFi
                </button>
              </div>
            }
          />

          <InfoRow
            label="WiFi Password"
            value="********"
          />
        </div>
      </div>
    </Modal>
  );
}

/* ===== Helper Row ===== */
function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b py-1 last:border-none">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 font-medium">{value || "-"}</div>
    </div>
  );
}
