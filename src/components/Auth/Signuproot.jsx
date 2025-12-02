"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useId, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import axios from "axios";

export default function SignUproot() {
  const [data, setData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    cfm_password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/register', data);
      console.log("Success:", res.data);
    } catch (error) {
      console.error("Register error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const id = useId();
  return (
    <form onSubmit={handleSubmit}>

        <InputGroup
          type="text"
          label="Username"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your Username"
          name="username"
          handleChange={handleChange}
          value={data.username}
        />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          type="text"
          label="First Name"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your First Name"
          name="first_name"
          handleChange={handleChange}
          value={data.first_name}
        />

        <InputGroup
          type="text"
          label="Last Name"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your Last Name"
          name="last_name"
          handleChange={handleChange}
          value={data.last_name}
        />

        <InputGroup
          type="email"
          label="Email"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your Email Address"
          name="email"
          handleChange={handleChange}
          value={data.email}
        />

        <InputGroup
          type="text"
          label="Phone"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your phone number"
          name="phone"
          handleChange={handleChange}
          value={data.phone}
        />

        <InputGroup
          type="password"
          label="Password"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your password"
          name="password"
          handleChange={handleChange}
          value={data.password}
          icon={<PasswordIcon />}
        />

        <InputGroup
          type="password"
          label="Confirm Password"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your confirmation password"
          name="cfm_password"
          handleChange={handleChange}
          value={data.cfm_password}
          icon={<PasswordIcon />}
        />
      </div>

      <div className="mt-10 mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign Up
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          )}
        </button>
      </div>

    </form>
  );
}
