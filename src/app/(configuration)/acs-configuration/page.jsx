"use client";
import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export default function ACSConfig() {
  const [form, setForm] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ShowcaseSection title="GenieACS Configuration" className="!p-6.5">
      <form action="#">
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

        <button className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 mt-5">
          Save Configuration
        </button>
      </form>
    </ShowcaseSection>
  );
}
