"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import ForgotPasswordForm from "../forgot-password/ForgotPasswordForm";
import InputGroup from "@/components/FormElements/InputGroup";
import Link from "next/link";

export default function SignInForm() {
  const [openForgot, setOpenForgot] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const activated = searchParams.get("activated");

  useEffect(() => {
    if (activated === "true") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account is activated, please login.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    
    if (activated === "false") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error have been occurred",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [activated]);

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
      const res = await signIn("credentials", {
        redirect: false,
        username: data.username,
        password: data.password,
        callbackUrl: "/dashboard",
      });
        if (!res?.error) {
          router.push(res.url);
        } else {
          const parsed = JSON.parse(res?.error);
            Swal.fire({
              icon: "error",
              title: "Login Failed",
              text: parsed.message,
            });        
        }
      } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops an error occured.",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <InputGroup
          type="text"
          label="Username"
          className="mb-4 [&_input]:py-[15px]"
          placeholder="Enter your username"
          name="username"
          onChange={handleChange}
          value={data.username}
        />

        <InputGroup
          type="password"
          label="Password"
          className="mb-5 [&_input]:py-[15px]"
          placeholder="Enter your password"
          name="password"
          onChange={handleChange}
          value={data.password}
        />

        <div className="mb-6 flex items-center justify-end gap-2 py-2 font-medium">
          <button
            type="button"
            onClick={() => setOpenForgot(true)}
            className="hover:text-primary dark:text-white dark:hover:text-primary"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mb-4.5">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            disabled={loading}
          >
            Sign In
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </button>
        </div>
      </form>

        <p className="text-center">
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>

      <ForgotPasswordForm
        open={openForgot}
        onClose={() => setOpenForgot(false)}
      />
    </>
  );
}
