"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui-elements/button";
import ForgotPasswordForm from "../forgot-password/ForgotPasswordForm";
import InputGroup from "@/components/FormElements/InputGroup";
import Alert from "@/lib/Alert";

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
      Alert.success("Success", "Account is activated, please login")
    }
    
    if (activated === "false") {
      Alert.error("Error", "n error have been occurred")
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
            Alert.error("Error", parsed.message)
        }
      } catch (error) {
        Alert.error("Error", error.message)
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
          <Button
            type="button"
            onClick={() => setOpenForgot(true)}
            label="Forgot Password?"
            variant="primary"
            size="small"
            className="bg-transparent hover:bg-transparent text-black dark:text-white dark:hover:text-primary p-0"
          />
        </div>

        <div className="mb-4.5">
          <Button
            type="submit"
            label="Sign In"
            variant="primary"
            shape="rounded"
            size="default"
            className="w-full gap-2 p-4"
            disabled={loading}
          >
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
            )}
          </Button>
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
