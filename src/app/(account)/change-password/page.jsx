"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ChangePasswordForm } from "../account-settings/_components/change-password";
import { ZodError } from "zod";
import Alert from "@/lib/Alert";

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
      Alert.error("Error", "New password and confirm password do not match.")      
    }

    try {        
      setLoading(true);
      const res = await axios.patch("/api/auth/change-password", {
        user_id: session.user.id,
        old_password,
        new_password        
      });
      if (res.status !== 200 || !res.data?.success) {
        throw new Error(res.data?.message || "Password change failed");
      }

      Alert.success("Success", res.data.message
      ).then(() => {
        setFormData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      })
    } catch (error) {
      let messages = [];
      if (error instanceof ZodError) {
        messages = error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`);
      } else if (error.response?.data?.message) {
        try {
          const parsed = JSON.parse(error.response.data.message);
          if (Array.isArray(parsed)) {
            messages = parsed.map(issue => `${issue.message}`);
          } else {
            messages = [error.response.data.message];
          }
        } catch (parseErr) {
          messages = [error.response.data.message];
        }
      } else {
        messages = [error.message || "Something went wrong"];
      }

      const msg = messages.map(m => `• ${m}`).join("<br>") || "Something went wrong."
      Alert.error("Error", msg)
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
