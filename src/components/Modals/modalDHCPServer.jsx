"use client";

import { useEffect, useState } from "react";
import Modal from "./modal";
import InputGroup from "../FormElements/InputGroup";
import { Select } from "../FormElements/select";

export default function DHCPServerModal({ open, onClose, device }) {
  const [form, setForm] = useState(null);

  // Isi form dari device.dhcp_server saat modal dibuka
  useEffect(() => {
    if (!device?.dhcp_server || !open) return;

    const dhcp = device.dhcp_server;

    setForm({
      enabled: dhcp.enabled ?? false,
      poolStart: dhcp.min_address ?? "",
      poolEnd: dhcp.max_address ?? "",
      subnetMask: dhcp.subnet_mask ?? "",
      gateway: dhcp.gateway ?? "",
      dns: dhcp.dns_servers ?? "",
      leaseTime: dhcp.lease_time ?? 86400,
    });
  }, [device, open]);

  // Hindari render sebelum data siap
  if (!form) return null;

  const isDisabled = !form.enabled;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Payload sesuai format backend
    const payload = {
      dhcp_server: {
        enabled: form.enabled,
        min_address: form.poolStart,
        max_address: form.poolEnd,
        subnet_mask: form.subnetMask,
        gateway: form.gateway,
        dns_servers: form.dns,
        lease_time: Number(form.leaseTime),
      },
    };

    console.log("Submit DHCP Config:", payload);

    // TODO: panggil API di sini
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit DHCP Server" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Enable / Disable DHCP */}
        <Select
          label="DHCP Server"
          value={form.enabled ? "enabled" : "disabled"}
          items={[
            { label: "Enabled", value: "enabled" },
            { label: "Disabled", value: "disabled" },
          ]}
          onChange={(e) =>
            setForm({
              ...form,
              enabled: e.target.value === "enabled",
            })
          }
        />

        {/* IP Pool Start */}
        <InputGroup
          label="IP Address Pool Start"
          type="text"
          name="poolStart"
          value={form.poolStart}
          onChange={handleChange}
          disabled={isDisabled}
        />

        {/* IP Pool End */}
        <InputGroup
          label="IP Address Pool End"
          type="text"
          name="poolEnd"
          value={form.poolEnd}
          onChange={handleChange}
          disabled={isDisabled}
        />

        {/* Subnet Mask */}
        <InputGroup
          label="Subnet Mask"
          type="text"
          name="subnetMask"
          value={form.subnetMask}
          onChange={handleChange}
          disabled={isDisabled}
        />

        {/* Gateway */}
        <InputGroup
          label="Default Gateway"
          type="text"
          name="gateway"
          value={form.gateway}
          onChange={handleChange}
          disabled={isDisabled}
        />

        {/* DNS */}
        <InputGroup
          label="DNS Server"
          type="text"
          name="dns"
          value={form.dns}
          onChange={handleChange}
          disabled={isDisabled}
        />

        {/* Lease Time */}
        <InputGroup
          label="Lease Time (seconds)"
          type="number"
          name="leaseTime"
          value={form.leaseTime}
          onChange={handleChange}
          disabled={isDisabled}
        />

        {/* Action Buttons */}
        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex w-1/2 items-center justify-center rounded-lg border border-gray-300 p-[13px] font-medium"
          >
            Batal
          </button>

          <button
            type="submit"
            className="flex w-1/2 items-center justify-center rounded-lg bg-primary p-[13px] font-medium text-white"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </Modal>
  );
}
