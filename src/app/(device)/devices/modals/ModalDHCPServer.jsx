"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import Modal from "@/components/Modals/modal";
import { Button } from "@/components/ui-elements/button";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DHCPServerModal({ open, onClose, device }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
  }, [device, open]);

  if (!form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        device_id: device.device_id,
        parameters: {
          DHCPServerEnable: form.enabled,
          MinAddress: form.poolStart,
          MaxAddress: form.poolEnd,
          SubnetMask: form.subnetMask,
          IPRouters: form.gateway,
          DNSServers: form.dns,
          DHCPLeaseTime: Number(form.leaseTime),
        },
      };

      const response = await axios.post("/api/dhcp/update", payload);

      if (response.data.success) {
        console.log("DHCP updated:", response.data);
        onClose();
      } else {
        setError(response.data.message || "Failed to update DHCP configuration");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit DHCP Server" size="md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="text-red-500">{error}</div>}

        <Select
          label="DHCP Server"
          value={form.enabled ? "enabled" : "disabled"}
          items={[
            { label: "Enabled", value: "enabled" },
            { label: "Disabled", value: "disabled" },
          ]}
          onChange={(e) =>
            setForm({ ...form, enabled: e.target.value === "enabled" })
          }
        />
        <InputGroup
          label="IP Address Pool Start"
          name="poolStart"
          value={form.poolStart}
          onChange={handleChange}
          disabled={!form.enabled}
        />
        <InputGroup
          label="IP Address Pool End"
          name="poolEnd"
          value={form.poolEnd}
          onChange={handleChange}
          disabled={!form.enabled}
        />
        <InputGroup
          label="Subnet Mask"
          name="subnetMask"
          value={form.subnetMask}
          onChange={handleChange}
          disabled={!form.enabled}
        />
        <InputGroup
          label="Default Gateway"
          name="gateway"
          value={form.gateway}
          onChange={handleChange}
          disabled={!form.enabled}
        />
        <InputGroup
          label="DNS Server"
          name="dns"
          value={form.dns}
          onChange={handleChange}
          disabled={!form.enabled}
        />
        <InputGroup
          label="Lease Time (seconds)"
          name="leaseTime"
          type="number"
          value={form.leaseTime}
          onChange={handleChange}
          disabled={!form.enabled}
        />

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            label="Batal"
            variant="outlineDark"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            label={loading ? "Saving..." : "Save Configuration"}
            variant="primary"
            className="flex-1"
            disabled={!form.enabled || loading}
          />
        </div>
      </form>
    </Modal>
  );
}
