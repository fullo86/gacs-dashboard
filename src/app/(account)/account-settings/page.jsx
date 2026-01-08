"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PersonalInfoForm } from "./_components/personal-info";
import { UploadPhotoForm } from "./_components/upload-photo";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      setForm({
        first_name: session.user.first_name || "",
        last_name: session.user.last_name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        password: ""
      });
    }
  }, [session?.user?.id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAccSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch("/api/account_settings", form);

      if (res.status !== 200 || !res.data?.success) {
        throw new Error(res.data?.message || "Update failed");
      }

      const updatedUser = res.data.data;

      await signIn("credentials", {
        redirect: false,
        username: updatedUser.username,
        password: form.password,
      });

      setForm({
        ...updatedUser,
        password: "",
      });

      Swal.fire({
        icon: "success",
        title: "Successfully Updated!",
        text: res.data.message,
      });

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      Swal.fire({
        icon: "error",
        title: "Oops an error occurred.",
        text: message,
      });
    }
  };

  if (status === "loading" || !form) {
    return (
      <div className="mx-auto w-full max-w-[1080px] space-y-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
            ))}
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="h-40 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <PersonalInfoForm 
            data={form}
            onChange={handleChange}
            onSubmit={handleAccSubmit}
          />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <UploadPhotoForm />
        </div>
      </div>
    </>
  );
}
