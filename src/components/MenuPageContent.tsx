"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SHOP_CONFIG } from "@/lib/config";
import { useCartStore } from "@/lib/cart-store";
import { useAdminStore } from "@/lib/admin-store";
import { formatPrice } from "@/lib/menu-data";
import MenuCard from "./MenuCard";
import CartPanel from "./CartPanel";

export default function MenuPageContent() {
  const searchParams = useSearchParams();
  const mejaParam = searchParams.get("meja") || "";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isValidTable, setIsValidTable] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { setTableNumber, getTotalItems, getTotalPrice, items } = useCartStore();
  const { menuItems, categories, tables } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mejaParam) {
      const tableExists = tables.some(
        (t) => t.id === mejaParam && t.isActive
      );
      setIsValidTable(tableExists);
      if (tableExists) {
        setTableNumber(mejaParam);
      }
    } else {
      setIsValidTable(false);
    }
  }, [mejaParam, tables, setTableNumber]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchSearch =
        search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [menuItems, activeCategory, search]);

  const totalItems = mounted ? getTotalItems() : 0;
  const totalPrice = mounted ? getTotalPrice() : 0;

  if (!isValidTable) {
    return (
      <main className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-6 border border-red-100">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-3">
            Meja Tidak Valid
          </h1>
          <p className="text-charcoal-600 mb-8 leading-relaxed">
            Nomor meja &quot;{mejaParam || "(kosong)"}&quot; tidak ditemukan.
            Silakan scan QR Code yang tersedia di meja Anda.
          </p>
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warm-50 pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-charcoal-900 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  {SHOP_CONFIG.name}
                </h1>
                <p className="text-cream-400 text-xs font-medium">
                  {SHOP_CONFIG.slogan}
                </p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[10px] text-cream-400 block leading-tight font-medium">
                Meja
              </span>
              <span className="text-lg font-bold leading-tight">
                {mejaParam}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-cream-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-coffee-500/30 focus:bg-white/15 transition-all text-sm"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="sticky top-[132px] z-20 bg-warm-50/95 backdrop-blur-md border-b border-coffee-100/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-charcoal-900 text-white shadow-lg shadow-charcoal-900/20"
                    : "bg-white text-charcoal-700 border border-coffee-200/60 hover:border-coffee-300 hover:bg-cream-100"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-coffee-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-coffee-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-charcoal-800 font-semibold">
              Menu tidak ditemukan
            </p>
            <p className="text-charcoal-500 text-sm mt-1">
              Coba kata kunci lain atau pilih kategori berbeda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-500 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {mounted && totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="floating-cart"
        >
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
              {totalItems}
            </span>
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium block">
              {totalItems} item
            </span>
            <span className="text-cream-400 text-xs">Lihat keranjang</span>
          </div>
          <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
        </button>
      )}

      {/* Cart Panel */}
      {isCartOpen && (
        <>
          <div className="overlay" onClick={() => setIsCartOpen(false)} />
          <CartPanel
            tableNumber={mejaParam}
            onClose={() => setIsCartOpen(false)}
          />
        </>
      )}
    </main>
  );
}
