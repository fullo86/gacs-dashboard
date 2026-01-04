"use client";

import Modal from "@/components/Modals/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ===== HELPER SAFE RENDER ===== */
function safeValue(val) {
  if (val === null || val === undefined) return "-";
  if (typeof val === "object") return JSON.stringify(val);
  return val;
}

export default function ConnectedDeviceModal({
  open,
  onClose,
  device,
}) {
  if (!device) return null;

  const connectedDevices = Array.isArray(device.connected_devices)
    ? device.connected_devices
    : [];

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`Connected Devices (${device.connected_devices_count || 0})`}
      size="xl"
    >
      <div className="space-y-4 text-sm">

        <div className="rounded border border-stroke dark:border-dark-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
                <TableHead>#</TableHead>
                <TableHead>Hostname</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Interface</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {connectedDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No connected devices
                  </TableCell>
                </TableRow>
              ) : (
                connectedDevices.map((d, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>

                    <TableCell className="font-medium">
                      {safeValue(d.hostname)}
                    </TableCell>

                    <TableCell>
                      {safeValue(d.ip_address)}
                    </TableCell>

                    <TableCell className="font-mono text-xs">
                      {safeValue(d.mac_address)}
                    </TableCell>

                    <TableCell>
                      {safeValue(d.interface_type)}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          d.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {d.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </Modal>
  );
}
