"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { RecentDevices } from "@/components/Tables/recent-devices";

export function RecentDevicesPage({ className }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const response = await axios.get("/api/recent-devices");
        if (response.data.success) {
          setData(response.data.devices);
        } else {
          setError(response.data.message || "Failed to fetch devices");
        }
      } catch (err) {
        setError(err.message || "Error fetching devices");
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, []);

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-6 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"
          />
        ))}
      </div>
    );

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return <RecentDevices data={data} className={className} />;
}
