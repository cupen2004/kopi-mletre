"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import OrdersPanel from "./OrdersPanel";
import MenuManagement from "./MenuManagement";
import TablesPanel from "./TablesPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import SettingsPanel from "./SettingsPanel";

const TABS = [
  { id: "orders", name: "Pesanan" },
  { id: "menu", name: "Menu & Kategori" },
  { id: "tables", name: "Meja & QR" },
  { id: "analytics", name: "Analitik & Laporan" },
  { id: "settings", name: "Pengaturan" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const { logout, orders, menuItems } = useAdminStore();

  const todayOrders = orders.filter((o) => {
    const today = new Date().toDateString();
    return new Date(o.createdAt).toDateString() === today;
  });
  const todayRevenue = todayOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "waiting" || o.orderStatus === "confirmed"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <header className="bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <span className="text-xs font-bold text-white tracking-wider">KM</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight">Kopi Mletre</h1>
              <p className="text-zinc-400 text-xs font-medium">Enterprise Admin Console</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-zinc-400 hover:text-white text-sm font-medium flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pesanan Hari Ini</p>
            <p className="text-white text-3xl font-extrabold mt-2 tracking-tight">{todayOrders.length}</p>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Menunggu Proses</p>
            <p className="text-amber-400 text-3xl font-extrabold mt-2 tracking-tight">{pendingOrders}</p>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Omzet Hari Ini</p>
            <p className="text-emerald-400 text-2xl md:text-3xl font-extrabold mt-2 tracking-tight">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(todayRevenue)}
            </p>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-all" />
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Menu</p>
            <p className="text-white text-3xl font-extrabold mt-2 tracking-tight">{menuItems.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-1.5 border border-zinc-800 shadow-lg">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 text-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Content */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/80 p-6 shadow-2xl">
          {activeTab === "orders" && <OrdersPanel />}
          {activeTab === "menu" && <MenuManagement />}
          {activeTab === "tables" && <TablesPanel />}
          {activeTab === "analytics" && <AnalyticsPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
