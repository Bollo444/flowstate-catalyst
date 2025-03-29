import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-[#50B584] px-4 py-2 text-sm font-medium text-white transition-colors",
        "hover:bg-[#409C74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#50B584] focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}
