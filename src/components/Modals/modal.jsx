"use client";
import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}) {

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = {
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-6xl",
  }[size];

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-[10000] flex min-h-screen items-center justify-center p-4">
        <div
          className={`
            flex w-full flex-col
            ${sizeClass}
            max-h-[calc(100vh-2rem)]
            rounded-lg bg-white shadow-lg dark:bg-gray-dark
          `}
        >
          <div className="flex-shrink-0 border-b p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
             <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
