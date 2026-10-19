// ============================================
// KONFIGURASI KOPI MLETRE
// Edit file ini untuk mengubah pengaturan kedai
// ============================================

export const SHOP_CONFIG = {
  name: "Kopi Mletre",
  slogan: "Ngopi Santai, Rasa Istimewa",
  description: "Kedai kopi modern dengan cita rasa autentik nusantara",
  // Nomor WhatsApp kedai (format: kode negara tanpa +, tanpa spasi, tanpa tanda hubung)
  whatsappNumber: "6281234567890",
  // URL dasar website (ganti saat deploy)
  baseUrl: "https://kopimlete.com",
  // Alamat kedai
  address: "Jl. Kopi No. 1, Kota Malang, Jawa Timur",
  // Jam operasional
  operationalHours: "08:00 - 22:00 WIB",
  // Path gambar QRIS
  qrisImage: "/images/qris-placeholder.png",
};

export const PAYMENT_METHODS = [
  {
    id: "qris",
    name: "QRIS",
    description: "Bayar menggunakan QRIS (scan barcode)",
    icon: "qris",
  },
  {
    id: "whatsapp",
    name: "Bayar via WhatsApp",
    description: "Konfirmasi pembayaran melalui WhatsApp",
    icon: "whatsapp",
  },
];

// Admin credentials default (GANTI sebelum deploy!)
export const ADMIN_CONFIG = {
  username: "admin",
  // Password: admin123 (bcrypt hash)
  passwordHash: "$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQbLgSLm8k8.c5IqEqCfL2iHPyOWC6",
  defaultPassword: "admin123",
};

// Daftar meja default
export const DEFAULT_TABLES = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1).padStart(2, "0"),
  name: `Meja ${String(i + 1).padStart(2, "0")}`,
  isActive: true,
}));
