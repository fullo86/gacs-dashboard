"use client"
import { useState, useEffect } from "react";
import axios from "axios";

export default function useDevices(limit = 20) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("/api/devices/get_devices", {
        params: { limit, skip, parser: "fast" },
        withCredentials: true,
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to fetch");
      setDevices(res.data.devices);
      setHasMore(res.data.hasMore);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, [skip]);

  return { devices, loading, error, skip, setSkip, hasMore, fetchDevices };
}
