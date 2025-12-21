"use client";
import { useEffect, useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export default function ACSConfig() {
  const [loading, setLoading] = useState(false);
  const [configId, setConfigId] = useState(null);
  const [form, setForm] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`/api/genieacs_config`);
        if (res?.data?.data) {
          setConfigId(res.data.data.id);
          setForm({
            host: res.data.data.host || "",
            port: res.data.data.port || "",
            username: res.data.data.username || "",
            password: res.data.data.username || "",
          });
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    };

    fetchConfig();
  }, []);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (configId) {
        res = await axios.patch(`/api/genieacs_config/${configId}`, form)    
      }else{
        res = await axios.post(`/api/genieacs_config`, form)      
        setConfigId(res.data.data.id)
      }

      Swal.fire({
        icon: "success",
        title: res.data.message,
      });        
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post(`/api/genieacs_config/connection_test/${configId}`, {})

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
        });        
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message,
        });        
      }
    } catch (err) {
        Swal.fire({
          icon: "error",
          title: err.response?.data?.message || err.message,
        });        
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Breadcrumb pageName="ACS Configuration" />    
    <ShowcaseSection title="" className="!p-6.5">
      <form action="#" onSubmit={handleSubmit}>
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
        />

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={loading}
            className="flex w-1/2 items-center justify-center rounded-lg border border-primary bg-white p-[13px] font-medium text-primary hover:bg-primary hover:text-white transition"
          >
            Test Koneksi
            {loading && (
              <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent" />
            )}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex w-1/2 items-center justify-center rounded-lg border border-primary bg-white p-[13px] font-medium text-primary hover:bg-primary hover:text-white transition"
          >
            Save Configuration
            {loading && (
              <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent" />
            )}
          </button>
        </div>

        {/* <button className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 mt-5" disabled={loading}>
          Save Configuration
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button> */}
      </form>
    </ShowcaseSection>
    </>
  );
}
