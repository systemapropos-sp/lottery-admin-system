import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { QuickAccessButton, QuickAccessPanel } from "@/components/quick-access";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

interface LayoutShellProps {
  children: ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[100dvh]">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <HeaderBar />

      {/* Main Content */}
      <main className="ml-[260px] pt-[56px] min-h-[100dvh] bg-[#F5F5F0]">
        <motion.div
          key={typeof window !== "undefined" ? window.location.hash : ""}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>

      {/* Quick Access System */}
      <QuickAccessButton />
      <QuickAccessPanel />
    </div>
  );
}
