import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function RecentDevices({ data, className }) {
  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Recent Devices
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead>SN</TableHead>
            <TableHead>MAC</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>SSID</TableHead>
            <TableHead>RX</TableHead>
            <TableHead>STATUS</TableHead>            
            <TableHead>Last Inform</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((device) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={device.device_id}
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
              <TableCell>
                {device.last_inform_timestamp
                  ? new Date(device.last_inform_timestamp).toLocaleString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
