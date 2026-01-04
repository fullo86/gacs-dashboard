"use client";
import { useEffect, useState } from "react";
import Modal from "@/components/Modals/modal";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";


export default function WiFiConfigModal({ open, onClose, device }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!device?.wifi_ssid || !open) return;

    setForm({
      wifiSsid: device.wifi_ssid || "",
      securityMode: device.security_mode || "WPA2PSK",
      wifiPassword: "", 
      wlanIndex: device.wlan_index || 1,
    });
  }, [device, open]);

  if (!form) return null;

  const isOpenSecurity = form.securityMode !== "None";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.wifiSsid.length < 1 || form.wifiSsid.length > 32) {
      alert("SSID harus antara 1 sampai 32 karakter.");
      return;
    }

    if (isOpenSecurity) {
      if (!form.wifiPassword || form.wifiPassword.length < 8 || form.wifiPassword.length > 63) {
        alert("Password harus antara 8 sampai 63 karakter.");
        return;
      }
    }

    const payload = {
      device_id: device.device_id,
      wifi_ssid: form.wifiSsid,
      security_mode: form.securityMode,
      wifi_password: form.wifiPassword,
      wlan_index: form.wlanIndex,
    };

    console.log("Submit WiFi Config:", payload);

    // TODO: panggil API update WiFi disini

    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit WiFi Configuration" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup
          label="WiFi SSID"
          type="text"
          name="wifiSsid"
          value={form.wifiSsid}
          onChange={handleChange}
          placeholder="Masukkan SSID (1-32 karakter)"
        />

        <Select
          label="Security Mode"
          name="securityMode"
          value={form.securityMode}
          items={[
            { label: "WPA2-PSK (Recommended)", value: "WPA2PSK" },
            { label: "WPA-PSK", value: "WPAPSK" },
            { label: "WPA2PSK+WPAPSK", value: "WPA2PSKWPAPSK" },
            { label: "None (Open)", value: "None" },
          ]}
          onChange={handleChange}
        />

        {isOpenSecurity && (
          <InputGroup
            label="WiFi Password"
            type="password"
            name="wifiPassword"
            value={form.wifiPassword}
            onChange={handleChange}
            placeholder="Masukkan Password (8-63 karakter)"
          />
        )}

        <Select
          label="WLAN Interface"
          name="wlanIndex"
          value={form.wlanIndex}
          items={[
            { label: "WLAN 1 (2.4GHz - Default)", value: 1 },
            { label: "WLAN 2 (5GHz)", value: 2 },
          ]}
          onChange={handleChange}
        />

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
            Update WiFi
          </button>
        </div>
      </form>
    </Modal>
  );
}
