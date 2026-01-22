"use client";
import Modal from "@/components/Modals/modal";
import { Button } from "@/components/ui-elements/button";

export default function ViewWanModal({ open, onClose, wans }) {
  return (
    <Modal isOpen={open} onClose={onClose} title="View WAN" size="lg">
      {(!wans || wans.length === 0) && (
        <p className="text-center text-gray-500">No WAN found</p>
      )}

      {wans?.map((wan, idx) => (
        <div key={idx} className="mb-6 border p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 items-center">
              <span className="px-2 py-1 rounded bg-blue-500 text-white text-xs">{wan.type || "-"}</span>
              <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">{wan.status || "-"}</span>
            </div>
            <div className="flex gap-2">
              <Button type="button" label="Edit" variant="yellow" size="small" />
              <Button type="button" label="Delete" variant="red" size="small" />
            </div>
          </div>

          <table className="w-full table-auto border border-gray-200">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Name</td>
                <td className="px-4 py-2">{wan.name || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Connection Type</td>
                <td className="px-4 py-2">{wan.connection_type || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Binding</td>
                <td className="px-4 py-2">{wan.binding || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">External IP</td>
                <td className="px-4 py-2">{wan.external_ip || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">MAC Address</td>
                <td className="px-4 py-2">{wan.mac_address || "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-semibold">Username</td>
                <td className="px-4 py-2">{wan.username || "-"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-semibold">Uptime</td>
                <td className="px-4 py-2">{wan.uptime || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </Modal>
  );
}
