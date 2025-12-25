'use client';
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
import { TrashIcon } from '@/assets/icons';
import { DownloadIcon, RefreshIcon, PreviewIcon } from './icons';
import DeviceOverviewModal from '@/components/Modals/modalDeviceOverview';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

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

  const handleDelete = async (device) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: `Device "${device.wifi_ssid}" akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      // 🔥 panggil API delete
      // await deleteDevice(device.id);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Device berhasil dihapus",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchDevices();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus device",
      });
    }
  };

  console.log(devices, 'asdd')
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {error && <p className="text-red-500">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
            <TableHead>SN</TableHead>
            <TableHead>MAC</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>SSID</TableHead>
            <TableHead>RX</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right xl:pr-7.5">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ?
              [...Array(limit)].map((_, idx) => (
                <TableRow key={idx} className="border-[#eee] dark:border-dark-3">
                  {[...Array(7)].map((__, i) => (
                    <TableCell key={i}>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : devices.length === 0
            ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No Data Found
                </TableCell>
              </TableRow>
            )
            : devices.map((device, index) => (
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
                    <p className="mt-[3px] text-body-sm font-small">{device.rx_power + ' DBM' || '-'}</p>
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
                  <TableCell className="xl:pr-7.5">
                    <div className="grid grid-cols-3 gap-3 place-items-center">
                      {[
                        {
                          icon: PreviewIcon,
                          label: "Preview",
                          onClick: () => {
                            setSelectedDevice(device);
                            setOpenPreview(true);
                          },
                        },
                        { icon: TrashIcon, label: "Delete" },
                        { icon: TrashIcon, label: "Delete" },
                        { icon: TrashIcon, label: "Delete" },
                        { icon: TrashIcon, label: "Delete" },
                        { icon: TrashIcon, label: "Delete" },
                        { icon: TrashIcon, label: "Delete" },
                        {
                          icon: RefreshIcon,
                          label: "Refresh",
                          className: loading ? "animate-spin" : "",
                          onClick: fetchDevices,
                        },
                        {
                          icon: TrashIcon,
                          label: "Delete",
                          className: "hover:text-red-500",
                          onClick: () => handleDelete(device),
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
        device={selectedDevice}
      />

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setSkip(Math.max(skip - limit, 0))}
          disabled={skip === 0}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>

        <button
          onClick={() => setSkip(skip + limit)}
          disabled={!hasMore}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
