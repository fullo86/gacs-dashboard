"use client";

import Signin from "@/components/Auth/Signin";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="relative flex h-screen w-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 shadow-lg transition hover:scale-105"
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

      <div className="flex h-full w-full flex-col xl:flex-row">
        <div className="flex flex-wrap w-full xl:w-1/2 items-center justify-center p-8 sm:p-12.5 xl:p-15">
          <Signin />
        </div>

        <div className="hidden xl:flex w-full xl:w-1/2">
          <div className="flex h-full w-full flex-col justify-between overflow-hidden px-12.5 pt-12.5 pb-8 custom-gradient-1 dark:!bg-dark-2 dark:bg-none transition-colors duration-300">
            
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

            <div>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Sign in to your account
              </p>
              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome Back!
              </h1>
              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Please sign in to your account by completing the necessary fields below
              </p>
            </div>

            <div className="mt-8">
              <Image
                src={"/images/grids/grid-02.svg"}
                alt="Illustration"
                width={405}
                height={325}
                className="mx-auto dark:opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// import Signin from "@/components/Auth/Signin";
// // import { signIn } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";

// export const metadata = {
//   title: "Sign in",
// };

// export default function SignIn() {
//   return (
//     <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900">
//       <div className="flex h-full w-full flex-col xl:flex-row">
        
//         <div className="flex flex-wrap w-full xl:w-1/2 items-center justify-center p-8 sm:p-12.5 xl:p-15">
//           <Signin />
//         </div>

//         <div className="hidden xl:flex w-full xl:w-1/2">
//           <div className="flex h-full w-full flex-col justify-between overflow-hidden px-12.5 pt-12.5 pb-8 custom-gradient-1 dark:!bg-dark-2 dark:bg-none">
            
//             <Link className="mb-6 inline-block" href="/">
//               <Image
//                 className="hidden dark:block"
//                 src={"/images/logo/logo.svg"}
//                 alt="Logo"
//                 width={176}
//                 height={32}
//               />
//               <Image
//                 className="dark:hidden"
//                 src={"/images/logo/logo-dark.svg"}
//                 alt="Logo"
//                 width={176}
//                 height={32}
//               />
//             </Link>

//             <div>
//               <p className="mb-3 text-xl font-medium text-dark dark:text-white">
//                 Sign in to your account
//               </p>
//               <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
//                 Welcome Back!
//               </h1>
//               <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
//                 Please sign in to your account by completing the necessary fields below
//               </p>
//             </div>

//             <div className="mt-8">
//               <Image
//                 src={"/images/grids/grid-02.svg"}
//                 alt="Illustration"
//                 width={405}
//                 height={325}
//                 className="mx-auto dark:opacity-30"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// // export default function SignIn() {
// //   return (
// //     <>
// //       <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
// //         <div className="flex flex-wrap items-center">
// //           <div className="w-full xl:w-1/2">
// //             <div className="w-full p-4 sm:p-12.5 xl:p-15">
// //               <Signin />
// //             </div>
// //           </div>

// //           <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
// //             <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
// //               <Link className="mb-10 inline-block" href="/">
// //                 <Image
// //                   className="hidden dark:block"
// //                   src={"/images/logo/logo.svg"}
// //                   alt="Logo"
// //                   width={176}
// //                   height={32}
// //                 />
// //                 <Image
// //                   className="dark:hidden"
// //                   src={"/images/logo/logo-dark.svg"}
// //                   alt="Logo"
// //                   width={176}
// //                   height={32}
// //                 />
// //               </Link>
// //               <p className="mb-3 text-xl font-medium text-dark dark:text-white">
// //                 Sign in to your account
// //               </p>

// //               <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
// //                 Welcome Back!
// //               </h1>

// //               <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
// //                 Please sign in to your account by completing the necessary
// //                 fields below
// //               </p>

// //               <div className="mt-31">
// //                 <Image
// //                   src={"/images/grids/grid-02.svg"}
// //                   alt="Logo"
// //                   width={405}
// //                   height={325}
// //                   className="mx-auto dark:opacity-30"
// //                 />
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }
