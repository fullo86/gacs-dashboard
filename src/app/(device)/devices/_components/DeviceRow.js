"use client";
import axios from "axios";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Alert from "@/lib/Alert";
import { Button } from "@/components/ui-elements/button";

import {
  PreviewIcon,
  LightningIcon,
  RouterIcon,
  WifiIcon,
  ConnectedDeviceIcon,
  EyeOffIcon,
  AddRemoveTagIcon,
  WanIcon,
} from "@/components/Icons/Icons";

export default function DeviceRow({
  device,
  visibleTags,
  toggleTags,
  onSelectDevice,
}) {
  const actions = [
    { icon: PreviewIcon, label: "Preview", onClick: () => onSelectDevice(device, "preview") },
    { icon: LightningIcon, label: "Summon Device", onClick: async () => {
        try {
          const res = await axios.post(
            "/api/devices/summon",
            { device_id: device.device_id },
            { withCredentials: true }
          );

          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          Alert.success("Success", "Device Successfully Summoned");
        } catch (err) {
          Alert.error(
            "Error",
            err.response?.data?.message || err.message
          );
        }
      },
    },
    { icon: RouterIcon, label: "Edit DHCP Server", onClick: () => onSelectDevice(device, "dhcp") },
    { icon: WifiIcon, label: "Edit WiFi", onClick: () => onSelectDevice(device, "wifi") },
    { icon: EyeOffIcon, label: "Show / Hide Tags", onClick: () => toggleTags(device.device_id) },
    { icon: AddRemoveTagIcon, label: "Add / Remove Tags", onClick: () => onSelectDevice(device, "tags") },
    { icon: WanIcon, label: "Manage WAN", onClick: () => onSelectDevice(device, "wan") },
    { icon: ConnectedDeviceIcon, label: "Connected Device", onClick: () => onSelectDevice(device, "connected") },
  ];

  return (
    <TableRow className="border-[#eee] dark:border-dark-3">
      <TableCell>{device.serial_number || "-"}</TableCell>
      <TableCell>{device.mac_address || "-"}</TableCell>
      <TableCell>{device.ip_address || "-"}</TableCell>
      <TableCell>{device.wifi_ssid || "-"}</TableCell>
      <TableCell>
        {device.rx_power ? `${device.rx_power}/DBM` : "-"}
      </TableCell>

      <TableCell>
        <div
          className={cn(
            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
            {
              "bg-[#219653]/[0.08] text-[#219653]": device.status === "online",
              "bg-[#D34053]/[0.08] text-[#D34053]": device.status === "offline",
              "bg-[#FFA70B]/[0.08] text-[#FFA70B]": device.status === "unknown",
            }
          )}
        >
          {device.status || "unknown"}
        </div>
      </TableCell>

      <TableCell>
        {visibleTags[device.device_id]
          ? device.tags?.join(", ") || "N/A"
          : "-"}
      </TableCell>

      <TableCell>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 place-items-center">
          {actions.map(({ icon: Icon, label, onClick }, idx) => (
            <Button
              key={idx}
              onClick={onClick}
              title={label}
              variant="icon"
              size="icon"
              shape="full"
              className="transition duration-200 ease-in-out hover:scale-110 active:scale-95"
            >
              <Icon />
            </Button>
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}

// import axios from "axios";
// import { TableRow, TableCell } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import Alert from "@/lib/Alert";
// import {
//   PreviewIcon, LightningIcon, RouterIcon, WifiIcon,
//   TrashIcon, ConnectedDeviceIcon, EyeOffIcon, AddRemoveTagIcon
// } from "@/components/Icons/Icons";
// import { Button } from "@/components/ui-elements/button";

// export default function DeviceRow({ device, visibleTags, toggleTags, onSelectDevice }) {
//   const actions = [
//     { icon: PreviewIcon, label: "Preview", onClick: () => onSelectDevice(device, "preview") },
//     { icon: LightningIcon, label: "Summon Device", onClick: async () => {
//         try {
//           const res = await axios.post("/api/devices/summon", { device_id: device.device_id }, { withCredentials: true });
//           if (!res.data.success) throw new Error(res.data.message);
//           Alert.success("Success", "Device Successfully Summoned");
//         } catch (err) {
//           Alert.error("Error", err.response?.data?.message || err.message);
//         }
//       }
//     },
//     { icon: RouterIcon, label: "Edit DHCP Server", onClick: () => onSelectDevice(device, "dhcp") },
//     { icon: WifiIcon, label: "Edit WiFi", onClick: () => onSelectDevice(device, "wifi") },
//     { icon: EyeOffIcon, label: "Show/Hide Tags", onClick: () => toggleTags(device.device_id) },
//     { icon: AddRemoveTagIcon, label: "Add/Remove Tags", onClick: () => onSelectDevice(device, "tags") },
//     { icon: TrashIcon, label: "Manage WAN", onClick: () => onSelectDevice(device, "wan") },
//     { icon: ConnectedDeviceIcon, label: "Connected Device", onClick: () => onSelectDevice(device, "connected") },
//   ];

//   return (
//     <TableRow className="border-[#eee] dark:border-dark-3">
//       <TableCell>{device.serial_number || '-'}</TableCell>
//       <TableCell>{device.mac_address || '-'}</TableCell>
//       <TableCell>{device.ip_address || '-'}</TableCell>
//       <TableCell>{device.wifi_ssid || '-'}</TableCell>
//       <TableCell>{device.rx_power + '/DBM' || '-'}</TableCell>
//       <TableCell>
//         <div className={cn("max-w-fit rounded-full px-3.5 py-1 text-sm font-medium", {
//           'bg-[#219653]/[0.08] text-[#219653]': device.status === 'online',
//           'bg-[#D34053]/[0.08] text-[#D34053]': device.status === 'offline',
//           'bg-[#FFA70B]/[0.08] text-[#FFA70B]': device.status === 'unknown',
//         })}>
//           {device.status || 'unknown'}
//         </div>
//       </TableCell>
//       <TableCell>{visibleTags[device.device_id] ? (device.tags?.join(', ') || 'N/A') : '-'}</TableCell>
//       <TableCell>
//         <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 place-items-center">
//           {actions.map(({ icon: Icon, label, onClick }, idx) => (
//             <Button
//               key={idx}
//               onClick={onClick}
//               title={label}
//               variant="icon"
//               size="icon"
//               shape="full"
//               className="transition hover:scale-110 active:scale-95"
//             >
//               <Icon />
//             </Button>
//           ))}
//         </div>
//       </TableCell>
//       {/* <TableCell>
//         <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 place-items-center">
//           {actions.map(({ icon: Icon, label, onClick }, idx) => (
//             <button key={idx} onClick={onClick} title={label} className="text-gray-500 hover:text-primary transition duration-200 ease-in-out hover:scale-110 active:scale-95">
//               <Icon />
//             </button>
//           ))}
//         </div>
//       </TableCell> */}
//     </TableRow>
//   );
// }
