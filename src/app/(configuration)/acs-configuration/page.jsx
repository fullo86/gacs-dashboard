"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Button } from "@/components/ui-elements/button";
import Alert from "@/lib/Alert";
import { RandomString } from "@/lib/RandomString";

export default function ACSConfig() {
  const [configId, setConfigId] = useState(null);

  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [form, setForm] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    sec_key: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/genieacs_config");

        if (res?.data?.data) {
          setConfigId(res.data.data.id);
          setForm({
            host: res.data.data.host || "",
            port: res.data.data.port || "",
            username: res.data.data.username || "",
            password: res.data.data.password || "",
            sec_key: res.data.data.sec_key || ""
          });
        }
      } catch (err) {
        Alert.error("Error", err.response?.data?.message || err.message)
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true);

    try {
      let res;
      if (configId) {
        res = await axios.patch(`/api/genieacs_config/${configId}`, form);
      } else {
        res = await axios.post(`/api/genieacs_config`, form);
        setConfigId(res.data.data.id);
      }

      Alert.success("Success", res.data.message)
    } catch (err) {
      Alert.error("Error", err.response?.data?.message || err.message)
    } finally {
      setLoadingSave(false);
    }
  };

  const handleTestConnection = async () => {
    if (!configId) return;

    setLoadingTest(true);
    try {
      const res = await axios.post(
        `/api/genieacs_config/connection_test/${configId}`,
        {}
      );

      res.data?.success ? Alert.success("Success", res.data.message) : Alert.error("Error", res.data.message)
    } catch (err) {
      Alert.error("Error", err.response?.data?.message || err.message)
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="ACS Configuration" />

      <ShowcaseSection title="" className="!p-6.5">
        <form onSubmit={handleSubmit}>
          <InputGroup
            label="Host"
            type="text"
            name="host"
            placeholder="Enter your Host or IP Address"
            value={form.host}
            onChange={handleChange}
            className="mb-4.5"
          />

          <InputGroup
            label="Port"
            type="text"
            name="port"
            placeholder="Enter your Port"
            value={form.port}
            onChange={handleChange}
            className="mb-4.5"
          />

          <InputGroup
            label="Username"
            type="text"
            name="username"
            placeholder="Enter Username"
            value={form.username}
            onChange={handleChange}
            className="mb-4.5"
          />

          <InputGroup
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="mb-4.5"            
          />

          <div className="mb-4.5 flex items-end gap-2">
            <div className="flex-1">
              <InputGroup
                label="Security Key"
                type="text"
                name="sec_key"
                placeholder="Security Key"
                value={form.sec_key}
                readOnly
              />
            </div>

            <Button
              type="button"
              variant="outlineDark"
              shape="rounded"
              className="h-[46px]"
              onClick={() =>
                setForm(prev => ({
                  ...prev,
                  sec_key: RandomString(8),
                }))
              }
              label="Generate"
            />
          </div>

          <div className="mt-7 flex gap-3">
            <Button
              type="button"
              variant="primary"
              shape="rounded"
              className="w-1/2 p-[13px]"
              onClick={handleTestConnection}
              disabled={loadingTest || !configId}
              label={loadingTest ? "Testing..." : "Connection Test"}
            />

            <Button
              type="submit"
              variant="primary"
              shape="rounded"
              className="w-1/2 p-[13px]"
              disabled={loadingSave}
              label={loadingSave ? "Saving..." : "Save Configuration"}
            />
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
}
