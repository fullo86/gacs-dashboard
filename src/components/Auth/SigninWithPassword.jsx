"use client";
import Link from "next/link";
import React, { useId, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const router = useRouter();
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

  const id = useId();

  return (
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
        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
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
  );
}

// "use client";
// import Link from "next/link";
// import React, { useId, useState } from "react";
// import InputGroup from "../FormElements/InputGroup";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

// export default function SigninWithPassword() {
//   const [data, setData] = useState({
//     email: process.env.NEXT_PUBLIC_DEMO_USER_MAIL || "",
//     password: process.env.NEXT_PUBLIC_DEMO_USER_PASS || "",
//     remember: false,
//   });
//   const router = useRouter()
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setData({
//       ...data,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await signIn("credentials", {
//         redirect: false,
//         username: e.target.username.value,
//         password: e.target.password.value,
//         callbackUrl: '/'
//       })
//       if (!res?.error) {
//         router.push('/')
//       }else{
//         console.log(res.error)
//       }
//     } catch (error) {
//       console.log(error)            
//     }

//     setLoading(true);

//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   };

//   const id = useId();
//   return (
//     <form onSubmit={handleSubmit}>
//       <InputGroup
//         type="text"
//         label="Username"
//         className="mb-4 [&_input]:py-[15px]"
//         placeholder="Enter your username"
//         name="username"
//         onChange={handleChange}
//         value={data.username}
//       />

//       <InputGroup
//         type="password"
//         label="Password"
//         className="mb-5 [&_input]:py-[15px]"
//         placeholder="Enter your password"
//         name="password"
//         onChange={handleChange}
//         value={data.password}
//       />

//       <div className="mb-6 flex items-center justify-end gap-2 py-2 font-medium">
//         <Link
//           href="/auth/forgot-password"
//           className="hover:text-primary dark:text-white dark:hover:text-primary"
//         >
//           Forgot Password?
//         </Link>
//       </div>

//       <div className="mb-4.5">
//         <button
//           type="submit"
//           className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
//         >
//           Sign In
//           {loading && (
//             <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
//           )}
//         </button>
//       </div>
//     </form>
//   );
// }
