"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose, title, children,size = "md" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null
  
  const sizeClass = {
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-6xl",
  }[size];

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-[10000] flex min-h-screen items-center justify-center">
        <div className={`w-full ${sizeClass} rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark`}>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose}>✕</button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// "use client";

// export default function Modal({ isOpen, onClose, title, children }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/50"
//         onClick={onClose}
//       />

//       {/* Modal box */}
//       <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
//         {/* Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//             {title}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Content */}
//         <div>{children}</div>
//       </div>
//     </div>
//   );
// }
