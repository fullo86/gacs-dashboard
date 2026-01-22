"use client";
import { useState } from "react";
import { Button } from "@/components/ui-elements/button";
import Modal from "@/components/Modals/modal";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import axios from "axios";

export default function AddWANModal({ open, onClose, device, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    type: "PPPoE",
    connection_type: "IP_Routed",
    username: "",
    password: "",
    binding: "",
  });

  if (!device) return null;

  const wanTypeOptions = [
    { label: "PPPoE", value: "PPPoE" },
    { label: "DHCP", value: "DHCP" },
    { label: "Bridge", value: "Bridge" },
  ];

  const connectionTypeOptions = [
    { label: "IP Routed", value: "IP_Routed" },
    { label: "PPPoE Bridged", value: "PPPoE_Bridged" },
  ];

  const bindingOptions = [
    { label: "LAN1", value: "LAN1" },
    { label: "LAN2", value: "LAN2" },
    { label: "LAN3", value: "LAN3" },
    { label: "LAN4", value: "LAN4" },
    { label: "WAN", value: "WAN" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        device_id: device.device_id,
        connection_index: 1, // default index, bisa dinamis
        connection_type: form.type,
        name: form.name,
        parameters: {
          Username: form.username || "",
          Password: form.password || "",
          X_CT_COM_LanInterface: form.binding,
        },
      };

      const response = await axios.post("/api/wan", payload);

      if (response.data.success) {
        onSuccess?.();
        onClose();
      } else {
        alert(`Gagal menambahkan WAN: ${response.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan WAN: " + err.message);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Add WAN" size="md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <InputGroup
          label="WAN Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Internet_PPPoE"
        />

        <Select
          label="Type"
          items={wanTypeOptions}
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          placeholder="Select Type"
        />

        <Select
          label="Connection Type"
          items={connectionTypeOptions}
          value={form.connection_type}
          onChange={(e) =>
            setForm({ ...form, connection_type: e.target.value })
          }
          placeholder="Select Connection Type"
        />

        {form.type === "PPPoE" && (
          <>
            <InputGroup
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="PPPoE username"
            />
            <InputGroup
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="PPPoE password"
            />
          </>
        )}

        <Select
          label="Binding"
          items={bindingOptions}
          value={form.binding}
          onChange={(e) => setForm({ ...form, binding: e.target.value })}
          placeholder="Select Binding"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" label="Add WAN" variant="primary" size="small" />
          <Button
            type="button"
            label="Cancel"
            variant="outlineDark"
            size="small"
            onClick={onClose}
          />
        </div>
      </form>
    </Modal>
  );
}
