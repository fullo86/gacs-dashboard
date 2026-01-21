"use client";
import { Button } from "@/components/ui-elements/button";
import Modal from "@/components/Modals/modal";
import InputGroup from "@/components/FormElements/InputGroup";
import { useModalForm } from "@/hooks/useModalForm";

export default function DeviceWanModal({ open, onClose, device, onSubmit }) {
  const { form, handleChange, resetForm } = useModalForm({ wanName: "" }, open, [device]);

  if (!device) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wanName.trim()) return;

    await onSubmit?.({ device_id: device.device_id, wanName: form.wanName });
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Manage WAN" size="md">
      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        <InputGroup type="text" name="wanName" value={form.wanName} onChange={handleChange} placeholder="Enter WAN name" />
        <div className="flex justify-end">
          <Button type="submit" label="Add WAN" className="bg-blue-600 text-white rounded" disabled={!form.wanName?.trim()} />
        </div>
      </form>
    </Modal>
  );
}
