"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";

export default function SettingsPanel() {
  const { shopConfig, updateShopConfig } = useAdminStore();
  const [formData, setFormData] = useState({
    name: shopConfig.name,
    slogan: shopConfig.slogan,
    description: shopConfig.description,
    whatsappNumber: shopConfig.whatsappNumber,
    baseUrl: shopConfig.baseUrl,
    address: shopConfig.address,
    operationalHours: shopConfig.operationalHours,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateShopConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Shop Info */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
        <h3 className="text-white font-bold text-base mb-4">Informasi Kedai</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Nama Kedai
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Slogan
            </label>
            <input
              type="text"
              value={formData.slogan}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Alamat
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Jam Operasional
            </label>
            <input
              type="text"
              value={formData.operationalHours}
              onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
        <h3 className="text-white font-bold text-base mb-4">Pengaturan WhatsApp</h3>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Nomor WhatsApp (tanpa +, spasi, atau tanda hubung)
          </label>
          <input
            type="text"
            value={formData.whatsappNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                whatsappNumber: e.target.value.replace(/[^0-9]/g, ""),
              })
            }
            placeholder="62812345678"
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-zinc-500 text-xs mt-2">
            Contoh: 6281234567890 (gunakan kode negara 62 di depan)
          </p>
        </div>
      </div>

      {/* Website URL */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
        <h3 className="text-white font-bold text-base mb-4">Pengaturan Website</h3>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            URL Dasar Website
          </label>
          <input
            type="text"
            value={formData.baseUrl}
            onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            placeholder="https://kopimletre.com"
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-zinc-500 text-xs mt-2">
            URL ini digunakan untuk QR Code meja. Pastikan sesuai dengan domain atau tunnel link aktif.
          </p>
        </div>
      </div>

      {/* QRIS */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
        <h3 className="text-white font-bold text-base mb-4">QRIS Pembayaran</h3>
        <div className="text-center">
          <div className="w-48 h-48 mx-auto bg-zinc-950 rounded-2xl flex items-center justify-center border-2 border-dashed border-zinc-800 mb-4">
            <div className="text-center p-4">
              <svg className="w-10 h-10 mx-auto text-zinc-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-zinc-500 text-xs font-medium">QRIS Placeholder</p>
            </div>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Gambar QRIS akan ditampilkan saat pelanggan memilih pembayaran QRIS.
            <br />
            Letakkan file gambar di folder <code className="text-indigo-400 bg-zinc-950 px-1.5 py-0.5 rounded">/public/images/qris-placeholder.png</code>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-lg ${
          saved
            ? "bg-emerald-600 text-white shadow-emerald-600/30"
            : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30"
        }`}
      >
        {saved ? "✓ Pengaturan Disimpan!" : "Simpan Pengaturan"}
      </button>
    </div>
  );
}
