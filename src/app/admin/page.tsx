"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-950">
        <div className="w-12 h-12 rounded-2xl bg-coffee-800 flex items-center justify-center animate-pulse-soft">
          <span className="text-sm font-bold text-white">KM</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
