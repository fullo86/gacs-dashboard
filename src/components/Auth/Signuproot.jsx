"use client";
import React, { useId, useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import axios from "axios";
import { Alert } from "../ui-elements/alert";

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
  const [alerts, setAlerts] = useState([]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlerts([]);

    try {
      const res = await axios.post('/api/auth/register', data);
      setAlerts([{
        variant: "success",
        title: "Successfully Register",
        description: "Your account successfully created, please check mail to activate the account."
      }]);
     } catch (error) {
      let errorArray = [];

      if (error.response?.data?.error) {
        try {
          errorArray = JSON.parse(error.response.data.error);
        } catch (e) {
          errorArray = [{ message: "Terjadi kesalahan saat mendaftar." }];
        }
      } else {
        errorArray = [{ message: error.message }];
      }

      const descriptionList = (
        <ul className="list-disc pl-5">
          {errorArray.map((err, index) => (
            <li key={index}>{err.message}</li>
          ))}
        </ul>
      );

      setAlerts([
        {
          variant: "error",
          title: "",
          description: descriptionList,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const id = useId();
  return (
    <form onSubmit={handleSubmit}>
      {alerts.length > 0 && (
        <div className="mb-6 space-y-4">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              variant={alert.variant}
              title={alert.title}
              description={alert.description}
            />
          ))}
        </div>
      )}

      <InputGroup
        type="text"
        label="Username"
        className="[&_input]:py-[15px] mb-3"
        placeholder="Enter your Username"
        name="username"
        onChange={handleChange}
        value={data.username}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputGroup
          type="text"
          label="First Name"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your First Name"
          name="first_name"
          onChange={handleChange}
          value={data.first_name}
        />

        <InputGroup
          type="text"
          label="Last Name"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your Last Name"
          name="last_name"
          onChange={handleChange}
          value={data.last_name}
        />

        <InputGroup
          type="email"
          label="Email"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your Email Address"
          name="email"
          onChange={handleChange}
          value={data.email}
        />

        <InputGroup
          type="text"
          label="Phone"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your phone number"
          name="phone"
          onChange={handleChange}
          value={data.phone}
        />

        <InputGroup
          type="password"
          label="Password"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your password"
          name="password"
          onChange={handleChange}
          value={data.password}
        />

        <InputGroup
          type="password"
          label="Confirm Password"
          className="[&_input]:py-[15px] mb-3"
          placeholder="Enter your confirmation password"
          name="cfm_password"
          onChange={handleChange}
          value={data.cfm_password}
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


// "use client";
// import React, { useId, useState } from "react";
// import InputGroup from "../FormElements/InputGroup";
// import axios from "axios";
// import { Alert } from "../ui-elements/alert";

// export default function SignUproot() {
//   const [data, setData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     phone: "",
//     email: "",
//     password: "",
//     cfm_password: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [alerts, setAlerts] = useState([]);

//   const handleChange = (e) => {
//     setData({
//       ...data,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAlerts([]); // reset alert

//     try {
//       const res = await axios.post('/api/auth/register', data);
//       setAlerts([{
//         variant: "success",
//         title: "Successfully Register",
//         description: "Your account successfully created, please check mail to activate the account."
//       }]);
//     } catch (error) {
//       // Ambil array pesan error dari Zod
//       const errorMessages = error.response?.data?.errors?.map(err => err.message);
//       console.log(errorMessages)
//       const newAlerts = errorMessages.map(msg => ({
//         variant: "error",
//         title: "Registrasi Gagal",
//         description: msg
//       }));

//       setAlerts(newAlerts);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const id = useId();
//   return (
//     <form onSubmit={handleSubmit}>
//       {alerts.length > 0 && (
//         <div className="mb-6 space-y-4">
//           {alerts.map((alert, index) => (
//             <Alert
//               key={index}
//               variant={alert.variant}
//               title={alert.title}
//               description={alert.description}
//             />
//           ))}
//         </div>
//       )}

//         <InputGroup
//           type="text"
//           label="Username"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your Username"
//           name="username"
//           onChange={handleChange}
//           value={data.username}
//         />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <InputGroup
//           type="text"
//           label="First Name"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your First Name"
//           name="first_name"
//           onChange={handleChange}
//           value={data.first_name}
//         />

//         <InputGroup
//           type="text"
//           label="Last Name"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your Last Name"
//           name="last_name"
//           onChange={handleChange}
//           value={data.last_name}
//         />

//         <InputGroup
//           type="email"
//           label="Email"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your Email Address"
//           name="email"
//           onChange={handleChange}
//           value={data.email}
//         />

//         <InputGroup
//           type="text"
//           label="Phone"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your phone number"
//           name="phone"
//           onChange={handleChange}
//           value={data.phone}
//         />

//         <InputGroup
//           type="password"
//           label="Password"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your password"
//           name="password"
//           onChange={handleChange}
//           value={data.password}
//         />

//         <InputGroup
//           type="password"
//           label="Confirm Password"
//           className="[&_input]:py-[15px] mb-3"
//           placeholder="Enter your confirmation password"
//           name="cfm_password"
//           onChange={handleChange}
//           value={data.cfm_password}
//         />
//       </div>

//       <div className="mt-10 mb-4.5">
//         <button
//           type="submit"
//           className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
//         >
//           Sign Up
//           {loading && (
//             <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
//           )}
//         </button>
//       </div>

//     </form>
//   );
// }
