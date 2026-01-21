"use client"
import { useState } from "react";

export function useModalForm(initialValues, onSubmit) {
  const [form, setForm] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat submit.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => setForm(initialValues);

  return { form, setForm, loading, handleChange, handleSubmit, resetForm };
}
