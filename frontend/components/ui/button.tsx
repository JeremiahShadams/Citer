import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon";
}

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  const base = "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-500",
    outline: "border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-200",
    secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
    ghost: "hover:bg-zinc-800 text-zinc-200",
    destructive: "bg-red-600/20 text-red-400 hover:bg-red-600/30",
    link: "text-blue-400 underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-8 px-3 text-sm",
    xs: "h-6 px-2 text-xs",
    sm: "h-7 px-2.5 text-xs",
    lg: "h-9 px-4 text-sm",
    icon: "h-8 w-8",
  };
  return (
    <button
      className={cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)}
      {...props}
    />
  );
}
