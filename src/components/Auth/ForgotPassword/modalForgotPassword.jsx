"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import Modal from "@/components/Modals/modal";
import { Button } from "@/components/ui-elements/button";
import { Alert } from "@/components/ui-elements/alert";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setLoading(false);
      setAlerts([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setAlerts([]);

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });

      setAlerts([
        {
          variant: "success",
          title: "Email Sent",
          description: "Silakan cek email untuk reset password.",
        },
      ]);

      onClose();
    } catch (err) {
      let message = "Terjadi kesalahan. Silakan coba lagi.";
      if (err.response?.data?.message) message = err.response.data.message;

      setAlerts([
        {
          variant: "error",
          title: "Error",
          description: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Forgot Password" size="md">
      {alerts.length > 0 && (
        <div className="mb-4 space-y-4">
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputGroup
          ref={inputRef}
          label="Email"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="mt-7 flex gap-3">
          <Button
            type="button"
            label="Batal"
            onClick={onClose}
            disabled={loading}
            variant="outlineDark"
            shape="rounded"
            className="w-1/2 p-[13px] disabled:opacity-60"
          />

          <Button
            type="submit"
            label="Send Reset Link"
            variant="primary"
            shape="rounded"
            disabled={!email || loading}
            className="w-1/2 p-[13px] disabled:opacity-60"
            icon={
              loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )
            }
          />
        </div>
      </form>
    </Modal>
  );
}
