"use client";

import { useAdminStore, Order } from "@/lib/admin-store";
import { formatPrice } from "@/lib/menu-data";
import { useState } from "react";

const ORDER_STATUSES = [
  { value: "waiting", label: "Menunggu Konfirmasi", color: "bg-amber-500" },
  { value: "confirmed", label: "Dikonfirmasi", color: "bg-blue-500" },
  { value: "processing", label: "Diproses", color: "bg-purple-500" },
  { value: "ready", label: "Siap Disajikan", color: "bg-emerald-500" },
  { value: "completed", label: "Selesai", color: "bg-zinc-500" },
  { value: "cancelled", label: "Dibatalkan", color: "bg-red-500" },
];

const PAYMENT_STATUSES = [
  { value: "unpaid", label: "Belum Dibayar", color: "bg-red-500" },
  { value: "pending", label: "Menunggu Verifikasi", color: "bg-amber-500" },
  { value: "paid", label: "Lunas", color: "bg-emerald-500" },
];

export default function OrdersPanel() {
  const { orders, updateOrderStatus, updatePaymentStatus } = useAdminStore();
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filter === "all"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
          }`}
        >
          Semua ({orders.length})
        </button>
        {ORDER_STATUSES.map((s) => {
          const count = orders.filter((o) => o.orderStatus === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === s.value
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-zinc-950/40 rounded-2xl border border-zinc-800/60">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 flex items-center justify-center mb-3 border border-zinc-800">
            <span className="text-sm font-bold text-zinc-400 tracking-wider">OR</span>
          </div>
          <p className="text-zinc-400 font-medium text-sm">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900/90 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg transition-all hover:border-zinc-700"
            >
              <button
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order.id ? null : order.id
                  )
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-zinc-950 rounded-xl px-3.5 py-2 text-center border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                      Meja
                    </span>
                    <span className="text-white font-black text-base">
                      {order.tableNumber}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {order.customerName}
                    </p>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      {order.id} •{" "}
                      {new Date(order.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-white font-bold text-sm">
                      {formatPrice(order.total)}
                    </p>
                    <div className="flex gap-1.5 mt-1.5 justify-end">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          ORDER_STATUSES.find(
                            (s) => s.value === order.orderStatus
                          )?.color
                        }`}
                        title="Status Pesanan"
                      />
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          PAYMENT_STATUSES.find(
                            (s) => s.value === order.paymentStatus
                          )?.color
                        }`}
                        title="Status Pembayaran"
                      />
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      expandedOrder === order.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {expandedOrder === order.id && (
                <div className="px-5 pb-5 pt-2 border-t border-zinc-800 bg-zinc-950/30">
                  <div className="py-3 space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm py-1 border-b border-zinc-800/50 last:border-0"
                      >
                        <span className="text-zinc-300 font-medium">
                          {item.name} <span className="text-zinc-500 font-normal">x{item.quantity}</span>
                          {item.notes && (
                            <span className="text-amber-400/80 text-xs block italic">
                              Catatan: {item.notes}
                            </span>
                          )}
                        </span>
                        <span className="text-zinc-200 font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                      <span className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
                        Total Pembayaran
                      </span>
                      <span className="text-indigo-400 font-extrabold text-base">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                    {order.orderNotes && (
                      <p className="text-zinc-400 text-xs bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 mt-2">
                        <strong className="text-zinc-200">Catatan Pesanan:</strong> {order.orderNotes}
                      </p>
                    )}
                    <p className="text-zinc-400 text-xs pt-1">
                      Metode Pembayaran:{" "}
                      <strong className="text-zinc-200">
                        {order.paymentMethod === "qris" ? "QRIS" : "Via WhatsApp"}
                      </strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Status Pesanan
                      </label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as Order["orderStatus"]
                          )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Status Pembayaran
                      </label>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updatePaymentStatus(
                            order.id,
                            e.target.value as Order["paymentStatus"]
                          )
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
