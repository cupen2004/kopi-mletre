"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useAdminStore } from "@/lib/admin-store";
import { formatPrice } from "@/lib/menu-data";
import { PAYMENT_METHODS } from "@/lib/config";
import {
  generateWhatsAppMessage,
  generateWhatsAppUrl,
} from "@/lib/whatsapp";

interface CartPanelProps {
  tableNumber: string;
  onClose: () => void;
}

export default function CartPanel({ tableNumber, onClose }: CartPanelProps) {
  const {
    items,
    customerName,
    setCustomerName,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    updateQuantity,
    removeItem,
    updateItemNotes,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const { addOrder, shopConfig } = useAdminStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQris, setShowQris] = useState(false);

  const totalPrice = getTotalPrice();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = "Nama pemesan wajib diisi";
    }
    if (!paymentMethod) {
      newErrors.paymentMethod = "Pilih metode pembayaran";
    }
    if (items.length === 0) {
      newErrors.items = "Keranjang masih kosong";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validate()) return;

    // Create order record
    const order = {
      id: `ORD-${Date.now()}`,
      tableNumber,
      customerName: customerName.trim(),
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        quantity: i.quantity,
        price: i.menuItem.price,
        notes: i.notes,
      })),
      subtotal: totalPrice,
      total: totalPrice,
      paymentMethod,
      orderNotes,
      orderStatus: "waiting" as const,
      paymentStatus: "unpaid" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrder(order);

    // Generate WhatsApp message
    const message = generateWhatsAppMessage(
      tableNumber,
      customerName.trim(),
      items,
      paymentMethod,
      orderNotes
    );

    const waUrl = generateWhatsAppUrl(message);

    // Open WhatsApp
    window.open(waUrl, "_blank");

    // Clear cart
    clearCart();
    onClose();
  };

  return (
    <div className="slide-up-panel">
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-coffee-300" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-coffee-100">
        <div>
          <h2 className="text-xl font-bold text-coffee-900">Keranjang</h2>
          <p className="text-coffee-500 text-sm">Meja {tableNumber}</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-coffee-100 flex items-center justify-center hover:bg-coffee-200 transition-colors"
          aria-label="Tutup"
        >
          <svg
            className="w-5 h-5 text-coffee-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="px-5 py-4 space-y-5 max-h-[calc(90vh-200px)] overflow-y-auto">
        {/* Items */}
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-coffee-100 flex items-center justify-center mb-3">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>
            <p className="text-coffee-600 font-medium">Keranjang masih kosong</p>
            <p className="text-coffee-400 text-sm mt-1">
              Tambahkan menu dari daftar menu
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.menuItem.id}
                className="card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-coffee-900 text-sm">
                      {item.menuItem.name}
                    </h4>
                    <p className="text-coffee-500 text-xs mt-0.5">
                      {formatPrice(item.menuItem.price)} / item
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-coffee-800 text-sm">
                      {formatPrice(item.menuItem.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {/* Quantity + Delete */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.quantity === 1
                          ? removeItem(item.menuItem.id)
                          : updateQuantity(
                              item.menuItem.id,
                              item.quantity - 1
                            )
                      }
                      className="w-8 h-8 rounded-lg bg-coffee-100 text-coffee-700 flex items-center justify-center hover:bg-coffee-200 active:scale-90 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-bold text-coffee-900 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItem.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg bg-coffee-700 text-white flex items-center justify-center hover:bg-coffee-800 active:scale-90 transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    aria-label="Hapus item"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* Item notes */}
                <input
                  type="text"
                  placeholder="Catatan item (opsional)..."
                  value={item.notes}
                  onChange={(e) =>
                    updateItemNotes(item.menuItem.id, e.target.value)
                  }
                  className="mt-2 w-full text-xs px-3 py-2 rounded-lg bg-cream-100 border border-coffee-100 text-coffee-800 placeholder:text-coffee-400 focus:outline-none focus:ring-1 focus:ring-coffee-400"
                />
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            {/* Customer Name */}
            <div>
              <label className="block text-sm font-semibold text-coffee-800 mb-2">
                Nama Pemesan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Masukkan nama Anda"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.customerName;
                      return copy;
                    });
                  }
                }}
                className={`input-field ${
                  errors.customerName ? "border-red-400 ring-1 ring-red-400/30" : ""
                }`}
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
              )}
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-sm font-semibold text-coffee-800 mb-2">
                Catatan Pesanan
              </label>
              <textarea
                placeholder="Contoh: Gula sedikit saja, es batu banyak..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="input-field resize-none h-20 text-sm"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-coffee-800 mb-2">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      if (errors.paymentMethod) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.paymentMethod;
                          return copy;
                        });
                      }
                      if (method.id === "qris") {
                        setShowQris(true);
                      } else {
                        setShowQris(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? "border-coffee-600 bg-coffee-50"
                        : "border-coffee-100 bg-white hover:border-coffee-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        paymentMethod === method.id
                          ? "bg-coffee-700 text-white"
                          : "bg-coffee-100 text-coffee-600"
                      }`}
                    >
                      {method.icon === "qris" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-coffee-900">
                        {method.name}
                      </p>
                      <p className="text-coffee-500 text-xs">
                        {method.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            {/* QRIS Image */}
            {showQris && (
              <div className="card p-4 text-center">
                <p className="text-sm font-semibold text-coffee-800 mb-3">
                  Scan QRIS untuk pembayaran
                </p>
                <div className="w-48 h-48 mx-auto bg-coffee-100 rounded-xl flex items-center justify-center border-2 border-dashed border-coffee-300">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-coffee-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-coffee-500 text-xs">
                      QRIS akan ditampilkan<br />
                      setelah dikonfigurasi admin
                    </p>
                  </div>
                </div>
                <p className="text-coffee-500 text-xs mt-3">
                  Setelah melakukan pembayaran, kirim konfirmasi melalui WhatsApp
                </p>
              </div>
            )}

            {/* Total */}
            <div className="bg-coffee-50 rounded-2xl p-4 border border-coffee-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-coffee-600">
                  <span>Subtotal ({items.reduce((t, i) => t + i.quantity, 0)} item)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-coffee-600">
                  <span>Biaya tambahan</span>
                  <span>Rp0</span>
                </div>
                <div className="border-t border-coffee-200 pt-2 flex justify-between">
                  <span className="font-bold text-coffee-900">Total</span>
                  <span className="font-bold text-lg text-coffee-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Checkout Button */}
      {items.length > 0 && (
        <div className="px-5 py-4 border-t border-coffee-100 bg-cream-50">
          <button onClick={handleCheckout} className="btn-whatsapp w-full py-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pesan via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
