"use client";
import Alert from "@/lib/Alert";
import Modal from "@/components/Modals/modal";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { useModalForm } from "@/hooks/useModalForm";

export default function DeviceTagsModal({ open, onClose, device, onAddTag }) {
  const { form, setForm, loading, handleChange, handleSubmit } = useModalForm({ tag: "" }, async ({ tag }) => {
    if (!tag) return;

    try {
      await onAddTag([device.device_id], "add", tag);
      setForm({ tag: "" });
      Alert.success("Success", `Tag "${tag}" Successfully Added`);
      onClose();
    } catch (err) {
      console.error(err);
      Alert.error("Error", `Failed to Add Tag: ${err.message}`);
      onClose();
    }
  });

  const handleRemove = async (tag) => {
    try {
      await onAddTag([device.device_id], "remove", tag);
      Alert.success("Success", `Tag "${tag}" Successfully Deleted`);
      onClose();
    } catch (err) {
      console.error(err);
      Alert.error("Error", `Failed to Delete Tag: ${err.message}`);
      onClose();
    }
  };

  if (!device) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Manage Tags" size="md">
      <div className="space-y-6 text-sm">
        <div className="flex items-center space-x-2">
          <InputGroup
            type="text"
            placeholder="Enter tag name"
            value={form.tag}
            onChange={handleChange}
            name="tag"
            className="w-full rounded p-2"
          />
          <Button
            label={loading ? "Adding..." : "Add Tags"}
            onClick={handleSubmit}
            className="bg-blue-600 text-white rounded"
            disabled={!form.tag.trim() || loading}
          />
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Current Tags</h4>
          <div className="space-y-2">
            {device.tags?.length ? device.tags.map(t => (
              <div key={t} className="flex justify-between items-center">
                <span className="font-medium">{t}</span>
                <Button
                  onClick={() => handleRemove(t)}
                  variant="outlineDark"
                  size="small"
                  className="text-red-600 border-red-600 hover:bg-red-600/10 hover:text-red-800"
                >
                  Remove
                </Button>
              </div>
            )) : <p className="text-gray-500">No tags added yet.</p>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
