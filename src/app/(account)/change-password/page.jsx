"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChangePasswordForm } from "../account-settings/_components/change-password";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { old_password, new_password, confirm_password } = formData;

    if (new_password !== confirm_password) {
      return Swal.fire({
        icon: "error",
        title: "Password mismatch",
        text: "New password and confirm password do not match.",
      });
    }

    try {
      setLoading(true);
      const res = await axios.patch("/api/auth/change_password", {
        user_id: session.user.id,
        old_password,
        new_password,
      });

      if (res.status !== 200 || !res.data?.success) {
        throw new Error(res.data?.message || "Password change failed");
      }

      Swal.fire({
        icon: "success",
        title: "Password Changed Successfully",
        text: res.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops an error occurred.",
        text: error.response?.data?.message || error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-[1080px] space-y-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Change Password" />
      <ChangePasswordForm
        data={formData}
        onSubmit={handlePasswordSubmit}
        onChange={handleChange}
      />
    </>
  );
}
