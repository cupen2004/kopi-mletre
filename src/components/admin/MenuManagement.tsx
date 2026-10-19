"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { MenuItem, formatPrice } from "@/lib/menu-data";

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuAvailability, categories } =
    useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "kopi",
    image: "",
    isPopular: false,
    isNew: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "kopi",
      image: "",
      isPopular: false,
      isNew: false,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image || "",
      isPopular: item.isPopular || false,
      isNew: item.isNew || false,
    });
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        image: formData.image.trim() || "/images/menu/default.jpg",
        isPopular: formData.isPopular,
        isNew: formData.isNew,
      });
    } else {
      const newItem: MenuItem = {
        id: `menu-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        image: formData.image.trim() || "/images/menu/default.jpg",
        isPopular: formData.isPopular,
        isNew: formData.isNew,
        isAvailable: true,
      };
      addMenuItem(newItem);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Add button */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tambah Menu Baru
      </button>

      {/* Form Modal / Card */}
      {showForm && (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl animate-fade-in">
          <h3 className="text-white font-bold text-lg mb-4">
            {editingItem ? "Edit Menu" : "Tambah Menu Baru"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contoh: Es Kopi Susu"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="18000"
                  required
                />
              </div>
            </div>

            {/* Image File Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Foto Menu (Pilih dari Komputer / HP)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-xl text-sm font-semibold border border-zinc-700 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Pilih Gambar...
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.image && formData.image !== "/images/menu/default.jpg" && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 relative">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="text-red-400 text-xs hover:underline"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>
              <p className="text-zinc-500 text-xs mt-1.5">
                Pilih foto produk dari galeri komputer atau HP Anda secara langsung.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
                placeholder="Deskripsi singkat menu..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 text-white border border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <label className="flex items-center gap-3 text-zinc-300 text-sm cursor-pointer pt-4">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                />
                Menu Populer
              </label>
              <label className="flex items-center gap-3 text-zinc-300 text-sm cursor-pointer pt-4">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-indigo-600 focus:ring-indigo-500"
                />
                Menu Baru
              </label>
            </div>
            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
              >
                {editingItem ? "Simpan Perubahan" : "Tambah Menu"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-zinc-800 text-zinc-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu list */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`bg-zinc-900/90 rounded-2xl border border-zinc-800 p-4 flex items-center justify-between gap-4 transition-all hover:border-zinc-700 ${
              !item.isAvailable ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                {item.image && item.image !== "/images/menu/default.jpg" ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {item.category.slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <p className="text-white font-semibold text-sm truncate">
                    {item.name}
                  </p>
                  {item.isPopular && (
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/25 text-amber-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Populer
                    </span>
                  )}
                  {item.isNew && (
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                      Baru
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs mt-1">
                  <strong className="text-zinc-200">{formatPrice(item.price)}</strong> •{" "}
                  {categories.find((c) => c.id === item.category)?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => toggleMenuAvailability(item.id)}
                className={`p-2.5 rounded-xl transition-all ${
                  item.isAvailable
                    ? "text-emerald-400 hover:bg-emerald-500/10"
                    : "text-red-400 hover:bg-red-500/10"
                }`}
                title={item.isAvailable ? "Nonaktifkan" : "Aktifkan"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.isAvailable ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus "${item.name}"?`)) {
                    deleteMenuItem(item.id);
                  }
                }}
                className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                title="Hapus"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
