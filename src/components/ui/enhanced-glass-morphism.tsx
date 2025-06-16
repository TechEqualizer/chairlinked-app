
import React from "react";
import { cn } from "@/lib/utils";

interface EditingGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "content";
  border?: boolean;
}

export const EditingGlassCard: React.FC<EditingGlassCardProps> = ({
  children,
  className,
  variant = "primary",
  border = true,
}) => {
  const variantClasses = {
    primary: "bg-white/85 backdrop-blur-xl text-gray-900",
    secondary: "bg-white/75 backdrop-blur-lg text-gray-800", 
    content: "bg-white/90 backdrop-blur-md text-gray-900",
  };

  return (
    <div
      className={cn(
        "rounded-2xl",
        variantClasses[variant],
        border && "border border-white/40 shadow-lg shadow-black/10",
        "transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

interface EditingGlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "tab";
  active?: boolean;
  type?: "button";
}

export const EditingGlassButton: React.FC<EditingGlassButtonProps> = ({
  children,
  className,
  onClick,
  variant = "primary",
  active = false,
  type = "button",
}) => {
  const variantClasses = {
    primary: "bg-white/20 hover:bg-white/30 text-gray-900 border-white/30",
    secondary: "bg-gray-100/80 hover:bg-gray-200/80 text-gray-900 border-gray-200/50",
    tab: active 
      ? "bg-white/40 text-gray-900 border-white/50 shadow-sm" 
      : "bg-white/10 hover:bg-white/20 text-gray-700 border-white/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg backdrop-blur-md border",
        "transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white/20",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </button>
  );
};
