
import React, { useState } from "react";
import { EnhancedAdminSidebar } from "./EnhancedAdminSidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernAdminLayoutProps {
  children: React.ReactNode;
}

export const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-200">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-zinc-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-slate-800">ChairLinked Admin</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="flex w-full">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "lg:relative lg:translate-x-0 transition-transform duration-300 z-40",
          "lg:block", // Always visible on desktop
          isMobileMenuOpen 
            ? "fixed inset-y-0 left-0 translate-x-0" 
            : "fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0"
        )}>
          <EnhancedAdminSidebar onMobileClose={() => setIsMobileMenuOpen(false)} />
        </div>

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto",
          "p-3 sm:p-4 md:p-6 lg:p-6", // Responsive padding
          "min-h-screen" // Ensure full height
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
