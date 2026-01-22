"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        green: "bg-green text-white hover:bg-green/90",
        dark: "bg-dark text-white dark:bg-white/10",

        outlinePrimary:
          "border border-primary text-primary hover:bg-primary/10",
        outlineGreen:
          "border border-green text-green hover:bg-green/10",
        outlineDark:
          "border border-dark text-dark hover:bg-dark/10 dark:border-white/25 dark:text-white dark:hover:bg-white/10",

        icon: "bg-transparent text-gray-500 hover:text-primary",
      },
      shape: {
        default: "",
        rounded: "rounded-md",
        full: "rounded-full",
      },
      size: {
        default: "px-10 py-3.5",
        small: "px-6 py-[11px]",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "default",
      size: "default",
    },
  }
);

export function Button({
  label,
  icon,
  children,
  variant,
  shape,
  size,
  className,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, shape, size }), className)}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {label}
      {children}
    </button>
  );
}
