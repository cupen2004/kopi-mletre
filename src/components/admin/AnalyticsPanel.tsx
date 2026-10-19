"use client";

import { useAdminStore } from "@/lib/admin-store";
import { formatPrice } from "@/lib/menu-data";

export default function AnalyticsPanel() {
  const { orders, menuItems } = useAdminStore();

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const qrisCount = orders.filter((o) => o.paymentMethod === "qris").length;
  const waCount = orders.filter((o) => o.paymentMethod === "whatsapp").length;

  // Calculate top selling items
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemCounts[item.menuItemId]) {
        itemCounts[item.menuItemId] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemCounts[item.menuItemId].qty += item.quantity;
      itemCounts[item.menuItemId].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemCounts).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Pendapatan (Lunas)</p>
          <p className="text-emerald-400 text-3xl font-extrabold mt-2">{formatPrice(totalRevenue)}</p>
          <p className="text-zinc-500 text-xs mt-1">Dari {paidOrders.length} transaksi lunas</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Total Semua Pesanan</p>
          <p className="text-white text-3xl font-extrabold mt-2">{totalOrders}</p>
          <p className="text-zinc-500 text-xs mt-1">Semua status pesanan masuk</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Metode Pembayaran</p>
          <div className="flex gap-4 mt-3">
            <div>
              <p className="text-indigo-400 text-xl font-bold">{qrisCount}</p>
              <p className="text-zinc-500 text-xs">QRIS</p>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <p className="text-violet-400 text-xl font-bold">{waCount}</p>
              <p className="text-zinc-500 text-xs">WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
        <h3 className="text-white font-bold text-base mb-4">Menu Paling Laris</h3>
        {topItems.length === 0 ? (
          <p className="text-zinc-500 text-sm py-6 text-center">Belum ada data penjualan menu.</p>
        ) : (
          <div className="space-y-3">
            {topItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.name}</p>
                    <p className="text-zinc-400 text-xs">Terjual: <strong className="text-zinc-200">{item.qty} porsi</strong></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">{formatPrice(item.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
