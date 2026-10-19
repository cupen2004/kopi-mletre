"use client";

import { MenuItem, formatPrice } from "@/lib/menu-data";
import { useCartStore } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import Image from "next/image";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const [mounted, setMounted] = useState(false);
  const { items, addItem, updateQuantity } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted
    ? items.find((i) => i.menuItem.id === item.id)
    : undefined;
  const quantity = cartItem?.quantity || 0;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden group border border-coffee-100/50 transition-all duration-300 hover:shadow-lg hover:shadow-coffee-200/30 hover:-translate-y-1 ${
        !item.isAvailable ? "opacity-60" : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-cream-100 to-cream-200 overflow-hidden">
        {item.image && item.image !== "/images/menu/default.jpg" ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl font-bold text-coffee-700 opacity-60 group-hover:scale-110 transition-transform duration-500">
              KM
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {item.isPopular && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Populer
            </span>
          )}
          {item.isNew && (
            <span className="bg-olive-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Baru
            </span>
          )}
          {!item.isAvailable && (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Habis
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-charcoal-900 leading-tight mb-1 line-clamp-1">
          {item.name}
        </h3>
        <p className="text-charcoal-500 text-[11px] leading-snug mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-coffee-700 font-bold text-sm">
            {formatPrice(item.price)}
          </span>

          {item.isAvailable ? (
            quantity === 0 ? (
              <button
                onClick={() => addItem(item)}
                className="bg-charcoal-900 text-white w-8 h-8 rounded-xl flex items-center justify-center hover:bg-coffee-700 transition-colors shadow-sm"
                aria-label={`Tambah ${item.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-cream-100 rounded-xl p-1 border border-coffee-200/60">
                <button
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="w-6 h-6 rounded-lg bg-white text-charcoal-950 flex items-center justify-center hover:bg-coffee-100 transition-colors text-xs font-bold shadow-xs"
                >
                  -
                </button>
                <span className="text-xs font-bold text-charcoal-900 px-1">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="w-6 h-6 rounded-lg bg-charcoal-900 text-white flex items-center justify-center hover:bg-coffee-700 transition-colors text-xs font-bold shadow-xs"
                >
                  +
                </button>
              </div>
            )
          ) : (
            <span className="text-xs text-red-500 font-semibold px-2 py-1 bg-red-50 rounded-lg">
              Kosong
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
