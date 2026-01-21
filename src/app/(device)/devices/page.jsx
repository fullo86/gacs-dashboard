"use client";
import { useState, useEffect } from "react";
import { Table, TableBody, TableHeader, TableRow, TableHead as TH } from "@/components/ui/table";
import { Button } from "@/components/ui-elements/button";
import Swal from "sweetalert2";
import DHCPServerModal from "@/components/Modals/modalDHCPServer";
import DeviceOverviewModal from "./modals/modalDeviceOverview";
import WiFiConfigModal from "./modals/modalWifiConfig";
import ConnectedDeviceModal from "./modals/modalDeviceConnected";
import DeviceTagsModal from "./modals/ModalTagsAdd";
import DeviceWanModal from "./modals/modalWan";
import DeviceRow from "./_components/DeviceRow";
import useDevices from "@/hooks/useDevices";

export default function Devices() {
  const { devices: fetchedDevices, loading, skip, setSkip, hasMore } = useDevices(20);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    setDevices(fetchedDevices || []);
  }, [fetchedDevices]);

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

  const showAlert = (type, title, text, timer = 3000) =>
    Swal.fire({ icon: type, title, text, timer, showConfirmButton: false });

  const toggleTags = (deviceId) => {
    setVisibleTags(prev => ({ ...prev, [deviceId]: !prev[deviceId] }));
  };

  const handleSelectDevice = (device, modalType, alertFunc = null) => {
    setSelectedDevice(device);
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const modalComponents = {
    preview: DeviceOverviewModal,
    dhcp: DHCPServerModal,
    wifi: WiFiConfigModal,
    connected: ConnectedDeviceModal,
    tags: DeviceTagsModal,
    wan: DeviceWanModal,
  };

  const handleAddTag = (deviceIds, action, tag) => {
    setDevices(prev =>
      prev.map(d => {
        if (deviceIds.includes(d.device_id)) {
          if (action === "add") {
            const newTags = d.tags ? [...d.tags, tag] : [tag];
            return { ...d, tags: Array.from(new Set(newTags)) };
          } else if (action === "remove") {
            return { ...d, tags: (d.tags || []).filter(t => t !== tag) };
          }
        }
        return d;
      })
    );
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark dark:[&>th]:text-white">
            {["SN","MAC","IP","SSID","RX","STATUS","TAGS","ACTIONS"].map(h => <TH key={h}>{h}</TH>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? [...Array(20)].map((_, idx) => (
                <DeviceRow key={idx} device={{}} visibleTags={{}} toggleTags={() => {}} onSelectDevice={() => {}} />
              ))
            : devices.map(device => (
                <DeviceRow 
                  key={device.id || device.device_id} 
                  device={device} 
                  visibleTags={visibleTags} 
                  toggleTags={toggleTags} 
                  onSelectDevice={handleSelectDevice} 
                  showAlert={showAlert} 
                />
              ))
          }
        </TableBody>
      </Table>

      {Object.entries(modalComponents).map(([key, ModalComp]) => (
        <ModalComp
          key={key}
          open={modals[key]}
          onClose={() => setModals(p => ({ ...p, [key]: false }))}
          device={selectedDevice}
          onAddTag={key === "tags" ? handleAddTag : undefined}
          showAlert={showAlert}
        />
      ))}

      <div className="mt-4 flex justify-end gap-2">
        <Button
          onClick={() => setSkip(Math.max(skip - 20, 0))}
          disabled={skip === 0}
          label="Prev"
          variant="outlineDark"
          shape="rounded"
          size="small"
        />
        <Button
          onClick={() => setSkip(skip + 20)}
          disabled={!hasMore}
          label="Next"
          variant="outlineDark"
          shape="rounded"
          size="small"
        />
      </div>
    </div>
  );
}
