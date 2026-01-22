"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import Modal from "@/components/Modals/modal";
import { Button } from "@/components/ui-elements/button";
import { useRef, useState } from "react";
import axios from "axios";
import Alert from "@/lib/Alert";

export default function ForgotPasswordForm({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);

    await axios
      .post("/api/auth/forgot-password", { email })
      .finally(async () => {
        setEmail("");
        onClose();

        Alert.success("Success", "Please check your email to reset your password.")
        setLoading(false);
      });
  };
  return (
    <Modal isOpen={open} onClose={onClose} title="Forgot Password" size="md">
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
