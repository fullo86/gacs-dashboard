"use client"
import InputGroup from "@/components/FormElements/InputGroup";
import Modal from "@/components/Modals/modal";
import { Button } from "@/components/ui-elements/button";
import { useState } from "react";

export default function DeviceTagsModal({
  open,
  onClose,
  device,
  onAddTag,
}) {
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);

  if (!device) return null;

  const handleAddTag = async () => {
    if (newTag) {
      try {
        setLoading(true);
        const deviceIds = [device.device_id];
        const tag = newTag;
        const action = "add";

        await onAddTag(deviceIds, action, tag);

        setNewTag("");
        onClose();
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat menambahkan tag.");
      } finally {
        setLoading(false);
      }
    }
  };

    const handleRemoveTag = async (tag) => {
        try {
            setLoading(true);
            const deviceIds = [device.device_id];
            const action = "remove";
            
            await onAddTag(deviceIds, action, tag);

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat menghapus tag.");
        } finally {
            setLoading(false);
        }
    };  
  return (
    <Modal isOpen={open} onClose={onClose} title="Manage Tags" size="md">
      <div className="space-y-6 text-sm">
        <div className="flex items-center space-x-2">
          <InputGroup
            type="text"
            className="w-full rounded p-2"
            placeholder="Enter tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button
            label={loading ? "Adding..." : "Add Tags"}
            onClick={handleAddTag}
            className="bg-blue-600 text-white rounded"
            disabled={!newTag.trim() || loading}
          />
        </div>
        <div className="mt-4">
            <h4 className="font-semibold">Current Tags</h4>
            <div className="space-y-2">
                {device.tags && device.tags.length > 0 ? (
                device.tags.map((tag) => (
                    <div key={tag} className="flex justify-between items-center">
                    <span className="font-medium">{tag}</span>
                    <button
                        onClick={() => handleRemoveTag(tag)} // Memanggil handleRemoveTag dengan tag yang ingin dihapus
                        className="text-red-600 hover:text-red-800"
                    >
                        Remove
                    </button>
                    </div>
                ))
                ) : (
                <p className="text-gray-500">No tags added yet.</p>
                )}
            </div>
        </div>        
      </div>
    </Modal>
  );
}
