'use client';
import { useEffect, useState } from 'react';
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
import { DownloadIcon, PreviewIcon } from './icons';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit] = useState(20);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get('/api/devices/get_devices', {
        params: {
          limit,
          skip,
          parser: 'fast',
        },
        withCredentials: true,
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch');
      }

      setDevices(data.devices);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message 
        );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [skip]);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                {/* <TableHead className="min-w-[220px] xl:pl-7.5">
                    SN
                </TableHead> */}
                <TableHead>SN</TableHead>
                <TableHead>MAC</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>SSID</TableHead>
                <TableHead>RX</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right xl:pr-7.5">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {devices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Tidak ada device
                  </TableCell>
                </TableRow>
              )}

              {devices.map((device, index) => (
                <TableRow
                  key={device.id || index}
                  className="border-[#eee] dark:border-dark-3"
                >
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">
                      {device.serial_number || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">
                      {device.mac_address || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">
                      {device.ip_address || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">
                      {device.wifi_ssid || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="mt-[3px] text-body-sm font-small">
                      {device.rx_power + ' DBM' || '-'}
                    </p>
                  </TableCell>

                  {/* <TableCell>
                    <p className="text-dark dark:text-white">
                      {device.lastInform
                        ? dayjs(device.lastInform).format(
                            'MMM DD, YYYY HH:mm'
                          )
                        : '-'}
                    </p>
                  </TableCell> */}

                  <TableCell>
                    <div
                      className={cn(
                        'max-w-fit rounded-full px-3.5 py-1 text-sm font-medium',
                        {
                          'bg-[#219653]/[0.08] text-[#219653]':
                            device.status === 'online',
                          'bg-[#D34053]/[0.08] text-[#D34053]':
                            device.status === 'offline',
                          'bg-[#FFA70B]/[0.08] text-[#FFA70B]':
                            device.status === 'unknown',
                        }
                      )}
                    >
                      {device.status || 'unknown'}
                    </div>
                  </TableCell>

                  <TableCell className="xl:pr-7.5">
                    <div className="flex items-center justify-end gap-x-3.5">
                      <button className="hover:text-primary">
                        <PreviewIcon />
                      </button>

                      <button className="hover:text-primary">
                        <TrashIcon />
                      </button>

                      <button className="hover:text-primary">
                        <DownloadIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        </>
      )}
    </div>
  );
}
