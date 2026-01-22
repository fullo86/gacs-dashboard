"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui-elements/button";
import Modal from "@/components/Modals/modal";
import AddWANModal from "./ModalAddWan";
import ViewWanModal from "./ModalViewWan";

export default function DeviceWanModal({ open, onClose, device, onView, onRemoveAll }) {
  const [isAddWANOpen, setIsAddWANOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    if (open || isAddWANOpen || isViewOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isAddWANOpen, isViewOpen]);
  if (!device) return null;
  return (
    <>
    <Modal isOpen={open} onClose={onClose} title="Manage WAN" size="md">
      <div className="space-y-4">
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            label="View WAN"
            variant="outlineDark"
            size="small"
            className="flex-1"
            onClick={() => setIsViewOpen(true)}
          />
          <Button
            type="button"
            label="Add WAN"
            variant="primary"
            size="small"
            className="flex-1"
            onClick={() => setIsAddWANOpen(true)} 
          />
          <Button
            type="button"
            label="Remove All WAN"
            variant="outlineDark"
            size="small"
            className="flex-1 text-red-600 border-red-600 hover:bg-red-600/10 hover:text-red-800"
            onClick={onRemoveAll}
          />
        </div>
      </div>
    </Modal>


    <ViewWanModal
      open={isViewOpen}
      onClose={() => setIsViewOpen(false)}
      wans={device.wan_details || []}
    />

    <AddWANModal
        open={isAddWANOpen}
        onClose={() => setIsAddWANOpen(false)}
        device={device}
        onSubmit={(data) => {
          console.log("Submit WAN", data);
          setIsAddWANOpen(false);
        }}
        className="z-40"
    />
  </>    
  );
}
