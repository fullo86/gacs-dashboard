"use client";

import Signup from "@/components/Auth/Signup";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Register() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const darkMode = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  return (
    <div className="relative flex min-h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 shadow-lg transition hover:scale-105"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-900 dark:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        )}
      </button>

      <div className="flex w-full flex-col xl:flex-row">
        
        <div className="flex w-full xl:w-1/2 items-center justify-center p-8 sm:p-12.5 xl:p-15">
          <Signup />
        </div>

        <div className="hidden xl:flex w-full xl:w-1/2">
          <div
            className={`
              flex flex-col justify-between w-full h-full overflow-hidden
              px-12.5 pt-12.5 pb-8
              transition-colors duration-300

              ${darkMode 
                ? "bg-gradient-to-br from-gray-900 to-gray-800" 
                : "bg-gradient-to-br from-indigo-50 to-purple-100"
              }
            `}
          >
            <Link className="mb-6 inline-block" href="/">
              <Image
                className="hidden dark:block"
                src={"/images/logo/logo.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
              <Image
                className="dark:hidden"
                src={"/images/logo/logo-dark.svg"}
                alt="Logo"
                width={176}
                height={32}
              />
            </Link>

            <div className="flex-1 flex flex-col justify-center">
              <p className={darkMode ? "mb-3 text-xl font-medium text-gray-300" : "mb-3 text-xl font-medium text-gray-700"}>
                Register your account
              </p>
              <h1 className={darkMode ? "mb-4 text-2xl font-bold text-white sm:text-heading-3" : "mb-4 text-2xl font-bold text-gray-900 sm:text-heading-3"}>
                Welcome New User!
              </h1>
              <p className={darkMode ? "w-full max-w-[375px] font-medium text-gray-400" : "w-full max-w-[375px] font-medium text-gray-600"}>
                Completing the necessary fields below to register new account
              </p>
            </div>

            <div className="mt-8">
              <Image
                src={"/images/grids/grid-02.svg"}
                alt="Illustration"
                width={405}
                height={325}
                className={darkMode ? "mx-auto opacity-30" : "mx-auto opacity-80"}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
