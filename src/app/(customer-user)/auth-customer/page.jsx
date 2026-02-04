"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup";
import Alert from "@/lib/Alert";

export default function DeviceAccessPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  const [form, setForm] = useState({ sno: "", secKey: "" });
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleDarkMode = () => setTheme(darkMode ? "light" : "dark");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.sno || !form.secKey) {
      return Alert.warning("Error", "Please fill both Device ID and Security Key.");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/devices/user_access_device", {
        serial_number: form.sno,
        sec_key: form.secKey,
      });

      if (res.data.success) {
        Cookies.set("sno", form.sno, { expires: 1 / 24 });
        Cookies.set("sec_key", form.secKey, { expires: 1 / 24 });
        router.push("/user-device");
      } else {
        Alert.error("Error", res.data.message);
      }
    } catch (err) {
      Alert.error(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Button
        onClick={toggleDarkMode}
        variant="icon"
        size="icon"
        shape="full"
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center bg-gray-300 dark:bg-gray-700 shadow-lg transition hover:scale-105"
        title="Toggle dark mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </Button>

      <div className="w-full max-w-[480px] p-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg transition-colors"
        >
          <h1 className="mb-5 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Device Access
          </h1>

          <InputGroup
            type="text"
            placeholder="Enter Device Serial No"
            value={form.sno}
            onChange={handleChange("sno")}
          />

          <InputGroup
            type="password"
            placeholder="Enter Security Key"
            value={form.secKey}
            onChange={handleChange("secKey")}
          />

          <Button
            type="submit"
            label={loading ? "Processing..." : "Submit"}
            disabled={loading}
            variant="primary"
            shape="rounded"
            icon={
              loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )
            }
            className="w-full disabled:opacity-60 mt-5"
          />
        </form>
      </div>
    </div>
  );
}
