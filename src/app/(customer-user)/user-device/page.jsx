"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Table, TableBody, TableHeader, TableRow, TableHead as TH } from "@/components/ui/table";
import { Button } from "@/components/ui-elements/button";
import DeviceOverviewModal from "@/app/(device)/devices/modals/modalDeviceOverview";
import DHCPServerModal from "@/app/(device)/devices/modals/ModalDHCPServer";
import WiFiConfigModal from "@/app/(device)/devices/modals/modalWifiConfig";
import ConnectedDeviceModal from "@/app/(device)/devices/modals/modalDeviceConnected";
import DeviceTagsModal from "@/app/(device)/devices/modals/ModalTagsAdd";
import DeviceWanModal from "@/app/(device)/devices/modals/modalWan";
import DeviceRow from "@/app/(device)/devices/_components/DeviceRow";

export default function UserDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modals, setModals] = useState({
    preview: false,
    dhcp: false,
    wifi: false,
    connected: false,
    tags: false,
    wan: false,
  });
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [visibleTags, setVisibleTags] = useState({});
  const serial_number = Cookies.get("sno");
  const sec_key = Cookies.get("sec_key");
  
  const fetchDevices = async () => {
    if (!serial_number || !sec_key) return;

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("/api/devices/user_access_device", { serial_number, sec_key });
      if (res.data.success) {
        setDevices([res.data.device]); 
      } else {
        setError(res.data.message || "Failed to fetch device");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const toggleTags = (deviceId) => {
    setVisibleTags(prev => ({ ...prev, [deviceId]: !prev[deviceId] }));
  };

  const handleSelectDevice = (device, modalType) => {
    setSelectedDevice(device);
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const handleAddTag = async (device_ids, action, tag) => {
    setDevices(prev =>
      prev.map(d => {
        if (device_ids.includes(d.device_id)) {
          let newTags;
          if (action === "add") {
            newTags = d.tags ? [...d.tags, tag] : [tag];
            newTags = Array.from(new Set(newTags));
          } else if (action === "remove") {
            newTags = (d.tags || []).filter(t => t !== tag);
          }
          const updated = { ...d, tags: newTags };
          if (selectedDevice && selectedDevice.device_id === d.device_id) {
            setSelectedDevice(updated);
          }
          return updated;
        }
        return d;
      })
    );

    try {
      await axios.post("/api/devices/user-tags", { device_ids, action, tag, sec_key });
      fetchDevices();
    } catch (err) {
      console.error("Failed to update tags on server:", err);
    }
  };

  const modalComponents = {
    preview: DeviceOverviewModal,
    dhcp: DHCPServerModal,
    wifi: WiFiConfigModal,
    connected: ConnectedDeviceModal,
    tags: DeviceTagsModal,
    wan: DeviceWanModal,
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="rounded-lg border bg-white p-4 shadow dark:border-dark-3 dark:bg-gray-dark sm:p-7.5 transition-colors">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark dark:[&>th]:text-white">
                {["SN","MAC","IP","SSID","RX","STATUS","TAGS","ACTIONS"].map(h => <TH key={h}>{h}</TH>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow>
                  <TH colSpan={8} className="text-center py-4 text-gray-500">
                    No device found
                  </TH>
                </TableRow>
              ) : (
                devices.map(device => (
                  <DeviceRow
                    key={device.device_id}
                    device={device}
                    visibleTags={visibleTags}
                    toggleTags={toggleTags}
                    onSelectDevice={handleSelectDevice}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}

        {Object.entries(modalComponents).map(([key, ModalComp]) => (
          <ModalComp
            key={key}
            open={modals[key]}
            onClose={() => setModals(p => ({ ...p, [key]: false }))}
            device={selectedDevice}
            onAddTag={key === "tags" ? handleAddTag : undefined}
          />
        ))}
      </div>
    </div>
  );
}
