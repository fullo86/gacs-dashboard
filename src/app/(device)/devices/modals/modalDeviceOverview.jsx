"use client";
import Modal from "@/components/Modals/modal";
import { Button } from "@/components/ui-elements/button";
import { useState } from "react";

export default function DeviceOverviewModal({ open, onClose, device }) {
  if (!device) return null;

  const sections = [
    {
      title: "ⓘ Basic Information",
      fields: [
        { label: "Device ID", value: device.device_id },
        { label: "Serial Number", value: device.serial_number },
        { label: "MAC Address", value: device.mac_address },
        { label: "Last Inform", value: device.last_inform },
        { label: "Status", value: (
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${device.status === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {device.status}
            </span>
          ) 
        },
        { label: "Manufacturer", value: device.manufacturer },
        { label: "Product Class", value: device.product_class },
        { label: "OUI", value: device.oui },
      ],
    },
    {
      title: "⚙ Hardware / Software",
      fields: [
        { label: "Hardware Version", value: device.hardware_version },
        { label: "Software Version", value: device.software_version },
        { label: "Uptime (sec)", value: device.uptime },
      ],
    },
    {
      title: "◎ Optical Information",
      fields: [
        { label: "RX Power", value: `${device.rx_power} dBm` },
        { label: "Temperature", value: `${device.temperature} °C` },
      ],
    },
    {
      title: "🖧 Network Information",
      fields: [
        { label: "IP TR069", value: device.ip_address },
        { label: "WiFi SSID", value: device.wifi_ssid },
        { label: "WiFi Password", value: "********", isPassword: true },
        { label: "Full IP TR069", value: device.ip_tr069 ? (<a href={device.ip_tr069} target="_blank" className="text-primary underline">{device.ip_tr069}</a>) : "-" },
      ],
    },
     {
      title: "🖧 DHCP Server",
      fields: [
        { label: "Enabled", value: device.dhcp_server?.enabled ? "Yes" : "No" },
        { label: "Configurable", value: device.dhcp_server?.configurable ? "Yes" : "No" },
        { label: "IP Range", value: device.dhcp_server
                ? `${device.dhcp_server.min_address} - ${device.dhcp_server.max_address}`
                : "-" },
        { label: "Subnet Mask", value: device.dhcp_server?.subnet_mask },
        { label: "Gateway", value: device.dhcp_server?.gateway },
        { label: "DNS Server", value: device.dhcp_server?.dns_servers },
        { label: "Lease Time (sec)", value: device.dhcp_server?.lease_time },
      ],
    },
    {
      title: "🔑 Admin Web Access",
      fields: [
        { label: "Admin User", value: device.admin_user },
        { label: "Admin Password", value: device.admin_password, isPassword: true },
        { label: "Telecom Password", value: device.telecom_password, isPassword: true },
      ],
    },
  ];

  return (
    <Modal isOpen={open} onClose={onClose} title="Device Overview" size="xl">
      <div className="space-y-6 text-sm">
        {sections.map((sec) => (
          <div key={sec.title} className="rounded border border-stroke p-4 dark:border-dark-3">
            <h4 className="mb-3 font-semibold">{sec.title}</h4>
            {sec.fields.map((f, idx) => (
              <InfoRow key={idx} label={f.label} value={f.value} isPassword={f.isPassword} />
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}

function InfoRow({ label, value, isPassword }) {
  const [show, setShow] = useState(false);
  if (!isPassword) return (
    <div className="grid grid-cols-3 gap-2 border-b py-1 last:border-none">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 font-medium">{value ?? "-"}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-2 border-b py-1 last:border-none items-center">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 flex items-center font-medium">
        <span className="mr-2">{show ? value : "•".repeat(value?.length || 8)}</span>        
        <Button
          onClick={() => setShow(!show)}
          variant="icon"
          size="icon"
          shape="rounded"
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
          title={show ? "Hide" : "Show"}
        >
          {show ? "🙈" : "👁️"}
        </Button>
      </div>
    </div>
  );
}
