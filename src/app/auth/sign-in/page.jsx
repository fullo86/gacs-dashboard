"use client";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import SignInForm from "./SignInForm";
import { Button } from "@/components/ui-elements/button";

export default function SignIn() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const darkMode = theme === "dark";

  return (
    <div className="relative flex h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      <Button
        onClick={() => setTheme(darkMode ? "light" : "dark")}
        icon={darkMode ? "🌞" : "🌙"}
        variant="primary"
        shape="full"
        size="small"
        className="fixed bottom-4 right-4 z-50 h-12 w-12 p-0 bg-gray-300 dark:bg-gray-700 shadow-lg"
      />

      <div className="flex h-full w-full flex-col xl:flex-row">

        <div className="flex w-full xl:w-1/2 items-center justify-center p-8 sm:p-12.5 xl:p-15">
          <div className="w-full max-w-[600px]">
            <SignInForm />
          </div>
        </div>

        <div className="hidden xl:flex w-full xl:w-1/2">
          <div className="flex h-full w-full flex-col justify-between px-12.5 pt-12.5 pb-8 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src="/images/logo/logo.svg"
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <div>
              <h1 className="mb-4 text-2xl font-bold">Welcome Back!</h1>
              <p className="max-w-[375px] text-gray-600">
                Please sign in to your account by completing the fields below.
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
    </div>
  );
}
