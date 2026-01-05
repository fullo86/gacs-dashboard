"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import { Button } from "@/components/ui-elements/button";

export default function Register() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const darkMode = theme === "dark";

  return (
    <div className="relative flex min-h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

      <Button
        onClick={() => setTheme(darkMode ? "light" : "dark")}
        icon={darkMode ? "🌞" : "🌙"}
        variant="primary"
        shape="full"
        size="small"
        className="fixed bottom-4 right-4 z-50 h-12 w-12 p-0 bg-gray-300 dark:bg-gray-700 shadow-lg"
      />

      <div className="flex w-full flex-col xl:flex-row">

        <div className="flex w-full xl:w-1/2 items-center justify-center p-8 sm:p-12.5 xl:p-15">
          <div className="w-full max-w-[600px]">
            <SignUpForm />
          </div>
        </div>

        <div className="hidden xl:flex w-full xl:w-1/2">
          <div
            className={`
              flex flex-col justify-between w-full h-full overflow-hidden
              px-12.5 pt-12.5 pb-8 transition-colors duration-300
              ${darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800"
                : "bg-gradient-to-br from-indigo-50 to-purple-100"
              }
            `}
          >
            <Link className="mb-6 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <div className="flex-1 flex flex-col justify-center">
              <p className={`mb-3 text-xl font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Register your account
              </p>

              <h1 className={`mb-4 text-2xl font-bold sm:text-heading-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Welcome New User!
              </h1>

              <p className={`w-full max-w-[375px] font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Completing the necessary fields below to register new account
              </p>
            </div>

            <Image
              src="/images/grids/grid-02.svg"
              alt="Illustration"
              width={405}
              height={325}
              className={`mx-auto ${darkMode ? "opacity-30" : "opacity-80"}`}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
