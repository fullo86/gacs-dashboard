"use client";
import { Button } from "@/components/ui-elements/button";
import Modal from "@/components/Modals/modal";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { useModalForm } from "@/hooks/useModalForm";

export default function WiFiConfigModal({ open, onClose, device, onSubmit }) {
  const { form, handleChange, resetForm } = useModalForm(
    {
      wifiSsid: device?.wifi_ssid || "",
      securityMode: device?.security_mode || "WPA2PSK",
      wifiPassword: "",
      wlanIndex: device?.wlan_index || 1,
    },
    open,
    [device]
  );

  if (!form) return null;

  const isOpenSecurity = form.securityMode !== "None";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.wifiSsid || form.wifiSsid.length < 1 || form.wifiSsid.length > 32) {
      return alert("SSID harus antara 1 sampai 32 karakter.");
    }

    if (isOpenSecurity && (!form.wifiPassword || form.wifiPassword.length < 8 || form.wifiPassword.length > 63)) {
      return alert("Password harus antara 8 sampai 63 karakter.");
    }

    onSubmit?.({
      device_id: device.device_id,
      wifi_ssid: form.wifiSsid,
      security_mode: form.securityMode,
      wifi_password: form.wifiPassword,
      wlan_index: form.wlanIndex,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit WiFi Configuration" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup label="WiFi SSID" name="wifiSsid" value={form.wifiSsid} onChange={handleChange} placeholder="Masukkan SSID" />
        <Select
          label="Security Mode"
          name="securityMode"
          value={form.securityMode}
          onChange={handleChange}
          items={[
            { label: "WPA2-PSK (Recommended)", value: "WPA2PSK" },
            { label: "WPA-PSK", value: "WPAPSK" },
            { label: "WPA2PSK+WPAPSK", value: "WPA2PSKWPAPSK" },
            { label: "None (Open)", value: "None" },
          ]}
        />
        {isOpenSecurity && (
          <InputGroup
            label="WiFi Password"
            name="wifiPassword"
            type="password"
            value={form.wifiPassword}
            onChange={handleChange}
            placeholder="Masukkan Password"
          />
        )}
        <Select
          label="WLAN Interface"
          name="wlanIndex"
          value={form.wlanIndex}
          onChange={handleChange}
          items={[
            { label: "WLAN 1 (2.4GHz - Default)", value: 1 },
            { label: "WLAN 2 (5GHz)", value: 2 },
          ]}
        />

        <div className="mt-7 flex gap-3">
          <Button type="button" label="Batal" onClick={onClose} variant="outlineDark" shape="rounded" className="w-1/2 p-[13px]" />
          <Button type="submit" label="Update WiFi" variant="primary" shape="rounded" className="w-1/2 p-[13px]" disabled={!form.wifiSsid.trim()} />
        </div>
      </form>
    </Modal>
  );
}