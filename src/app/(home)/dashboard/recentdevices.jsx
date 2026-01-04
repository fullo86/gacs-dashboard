"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function RecentDevicesPage({ className }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await axios.get("/api/recent-devices");
        if (res.data?.success) {
          setData(res.data.devices || []);
        } else {
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-6 w-full rounded bg-gray-200 animate-pulse dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

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
              key={device.device_id}
              className="text-center text-base font-medium text-dark dark:text-white"
            >
              <TableCell>{device.serial_number || "-"}</TableCell>
              <TableCell>{device.mac_address || "-"}</TableCell>
              <TableCell>{device.ip_address || "-"}</TableCell>
              <TableCell>{device.wifi_ssid || "-"}</TableCell>
              <TableCell>
                {device.rx_power ? `${device.rx_power} DBM` : "-"}
              </TableCell>
              <TableCell>
                <div
                  className={cn(
                    "mx-auto max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                    {
                      "bg-[#219653]/[0.08] text-[#219653]":
                        device.status === "online",
                      "bg-[#D34053]/[0.08] text-[#D34053]":
                        device.status === "offline",
                      "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                        device.status === "unknown",
                    }
                  )}
                >
                  {device.status || "unknown"}
                </div>
              </TableCell>
              <TableCell>
                {device.last_inform_timestamp
                  ? new Date(device.last_inform_timestamp).toLocaleString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                No devices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
