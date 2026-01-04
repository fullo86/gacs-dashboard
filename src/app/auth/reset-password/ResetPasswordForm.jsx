"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui-elements/button";
import InputGroup from "@/components/FormElements/InputGroup";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleDarkMode = () => setTheme(darkMode ? "light" : "dark");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Confirmation password does not match.",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password successfully changed.",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/auth/sign-in");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 shadow-lg transition hover:scale-105"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      {/* Left Side: Form */}
      <div className="flex w-full xl:w-1/2 items-center justify-center p-8 sm:p-12.5 xl:p-15">
        <div className="w-full max-w-[500px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg transition-colors"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
              Reset Password
            </h1>

            <InputGroup
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <InputGroup
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            <Button
              type="submit"
              label={loading ? "Processing..." : "Reset Password"}
              disabled={loading}
              variant="primary"
              shape="rounded"
              icon={
                loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )
              }
              className="w-full disabled:opacity-60"
            />
          </form>
        </div>
      </div>

      {/* Right Side: Illustration */}
      <div className="hidden xl:flex w-full xl:w-1/2">
        <div className="flex h-full w-full flex-col justify-between px-12.5 pt-12.5 pb-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
          
          <Link href="/" className="mb-6 inline-block">
            <Image src="/images/logo/logo.svg" alt="Logo" width={176} height={32} />
          </Link>

          <div>
            <h1 className="mb-4 text-2xl font-bold">Welcome Back!</h1>
            <p className="max-w-[375px] text-gray-600 dark:text-gray-300">
              Please reset your password by completing the fields on the left.
            </p>
          </div>

          <Image
            src="/images/grids/grid-02.svg"
            alt="Illustration"
            width={405}
            height={325}
            className="mx-auto opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
