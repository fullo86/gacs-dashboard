"use client";
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { 
  DownloadIcon, 
  RefreshIcon, 
  PreviewIcon, 
  LightningIcon, 
  WifiIcon, 
  RouterIcon, 
  TrashIcon, 
  ConnectedDeviceIcon,
  EyeIcon,
  EyeOffIcon,
  AddRemoveTagIcon
} from '@/components/Icons/Icons';
import DHCPServerModal from '@/components/Modals/modalDHCPServer';
import DeviceOverviewModal from './modals/modalDeviceOverview';
import WiFiConfigModal from './modals/modalWifiConfig';
import ConnectedDeviceModal from './modals/modalDeviceConnected';
import { Button } from '@/components/ui-elements/button';
import DeviceTagsModal from './modals/ModalTagsAdd';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedDeviceOverview, setSelectedDeviceOverview] = useState(null);
  const [selectedDeviceDHCP, setSelectedDeviceDHCP] = useState(null);
  const [openDHCP, setOpenDHCP] = useState(false);
  const [dhcpForm, setDhcpForm] = useState({
  DHCPServerEnable: true,
  MinAddress: "192.168.1.10",
  MaxAddress: "192.168.1.200",
  SubnetMask: "255.255.255.0",
  IPRouters: "192.168.1.1",
  DNSServers: "8.8.8.8,8.8.4.4",
  DHCPLeaseTime: 86400,
});
const [openWiFi, setOpenWiFi] = useState(false);
const [selectedDeviceWiFi, setSelectedDeviceWiFi] = useState(null);
const [openConnectDevice, setConnectDevice] = useState(false);
const [selectedDeviceConnect, setSelectedDeviceConnect] = useState(null);
const [visibleTags, setVisibleTags] = useState({});
const [openDeviceTagsModal, setOpenDeviceTagsModal] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get('/api/devices/get_devices', {
        params: { limit, skip, parser: 'fast' },
        withCredentials: true,
      });

      const data = res.data;
      if (!data.success) throw new Error(data.message || 'Failed to fetch');

      setDevices(data.devices);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [skip]);

  const handleSummonDevice = async (device) => {
    try {
      const res = await axios.post(
        "/api/devices/summon",
        {
          device_id: device.device_id,
        },
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Device Successfully Summoned",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message,
      });
    }
  };

  const handleEditDhcpServer = async (device, dhcpForm) => {
    try {
      const res = await axios.post(
        "/api/devices/dhcp",
        {
          device_id: device.device_id,
          parameters: dhcpForm,
        },
        { withCredentials: true }
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "DHCP Server Updated",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || err.message,
        timer: 3000,
      });
    }
  };

  const handleIconClick = (deviceId) => {
    setVisibleTags((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  const handleTags = async (deviceId) => {
    const result = await Swal.fire({
      title: 'Add & Remove Tags',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Manage Tags',
      denyButtonText: 'Remove All Tags',
      showCloseButton: true,
      allowOutsideClick: true,
    });
    if (result.isConfirmed) {
      setSelectedDeviceConnect(deviceId.device_id);
      setOpenDeviceTagsModal(true);      
    } else if (result.isDenied) {
      try {
        const response = await axios.post("/api/tags", {
          action: "remove", 
          device_ids: [deviceId.device_id],
          tag: "",
        });
        if (response.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "All Tags Successfully Delete.",
            timer: 3000,
            showConfirmButton: false,
          }); 
        } else {
          console.log
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || error.message || "Tags Not Found",
            timer: 3000,
          });
        }
      } catch (err) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            timer: 3000,
          });
      }
      fetchDevices();      
    }
  };

  const handleAddTag = async (deviceIds, action, tag) => {
    try {
      const response = await axios.post('/api/tags', { action, device_ids: deviceIds, tag });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add tag.");
      }
      setOpenDeviceTagsModal(false);
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "New Tags Successfully Added.",
        timer: 3000,
        showConfirmButton: false,
      });      
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message,
        timer: 3000,
      });
    }
    fetchDevices();    
  };

  console.log(devices, 'asdd')
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* {error && <p className="text-red-500">{error}</p>} */}

      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>SN</TableHead>
            <TableHead>MAC</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>SSID</TableHead>
            <TableHead>RX</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>TAGS</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ?
              [...Array(limit)].map((_, idx) => (
                <TableRow key={idx} className="border-[#eee] dark:border-dark-3">
                  {[...Array(8)].map((__, i) => (
                    <TableCell key={i}>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : devices.length === 0
            ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No Data Found
                </TableCell>
              </TableRow>
            )
            : (devices || []).map((device, index) => (
                <TableRow key={device.id || index} className="border-[#eee] dark:border-dark-3">
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">{device.serial_number || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">{device.mac_address || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">{device.ip_address || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">{device.wifi_ssid || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">{device.rx_power + '/DBM' || '-'}</p>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        'max-w-fit rounded-full px-3.5 py-1 text-sm font-medium',
                        {
                          'bg-[#219653]/[0.08] text-[#219653]': device.status === 'online',
                          'bg-[#D34053]/[0.08] text-[#D34053]': device.status === 'offline',
                          'bg-[#FFA70B]/[0.08] text-[#FFA70B]': device.status === 'unknown',
                        }
                      )}
                    >
                      {device.status || 'unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {visibleTags[device.device_id]
                    ? Array.isArray(device.tags) && device.tags.length > 0
                      ? device.tags.join(', ')
                      : 'N/A'
                    : '-'}
                  </TableCell>
                  <TableCell className="xl:pr-7.5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 place-items-center">
                      {[
                        {
                          icon: PreviewIcon,
                          label: "Preview",
                          onClick: () => {
                            setSelectedDeviceOverview(device);
                            setOpenPreview(true);
                          },
                        },
                        { 
                          icon: LightningIcon, 
                          label: "Summon Device",
                          onClick: () => handleSummonDevice(device),
                        },
                        { 
                          icon: RouterIcon, 
                          label: "Edit DHCP Server",
                          onClick: () => {
                            setSelectedDeviceDHCP(device);
                            setOpenDHCP(true);
                          },
                        },
                        {
                          icon: WifiIcon,
                          label: "Edit WiFi",
                          onClick: () => {
                            setSelectedDeviceWiFi(device);
                            setOpenWiFi(true);
                          },
                        },
                        {
                          icon: EyeOffIcon, 
                          label: "Show/Hide Tags",
                          onClick: () => handleIconClick(device.device_id)
                        },
                        { 
                          icon: AddRemoveTagIcon, 
                          label: "Add/Remove Tags",
                          onClick: () => {
                            handleTags(device)
                          }
                        },
                        { icon: TrashIcon, label: "Delete" },
                        {
                          icon: ConnectedDeviceIcon,
                          label: "Connected Device",
                          onClick: () => {
                            setSelectedDeviceConnect(device);
                            setConnectDevice(true);
                          },
                        },
                      ].map(({ icon: Icon, label, onClick }, idx) => (
                        <button
                          key={idx}
                          onClick={onClick}
                          title={label}
                          className="
                            text-gray-500
                            hover:text-primary
                            transition
                            duration-200
                            ease-in-out
                            hover:scale-110
                            active:scale-95
                          "
                        >
                          <Icon />
                        </button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <DeviceOverviewModal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        device={selectedDeviceOverview}
      />

      <DHCPServerModal
        open={openDHCP}
        onClose={() => setOpenDHCP(false)}
        device={selectedDeviceDHCP}
      />

      <WiFiConfigModal
        open={openWiFi}
        onClose={() => setOpenWiFi(false)}
        device={selectedDeviceWiFi}
      />

      <ConnectedDeviceModal
        open={openConnectDevice}
        onClose={() => setConnectDevice(false)}
        device={selectedDeviceConnect}
      />

      <DeviceTagsModal 
        open={openDeviceTagsModal} 
        onClose={() => setOpenDeviceTagsModal(false)} 
        device={selectedDeviceConnect} 
        onAddTag={handleAddTag} 
      />

      <div className="mt-4 flex justify-end gap-2">
        <Button
          onClick={() => setSkip(Math.max(skip - limit, 0))}
          disabled={skip === 0}
          label="Prev"
          variant="outlineDark"
          shape="rounded"
          size="small"
          className="px-3 py-1 disabled:opacity-50"
        />

        <Button
          onClick={() => setSkip(skip + limit)}
          disabled={!hasMore}
          label="Next"
          variant="outlineDark"
          shape="rounded"
          size="small"
          className="px-3 py-1 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
