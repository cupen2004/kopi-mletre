// ============================================
// DATA MENU CONTOH - KOPI MLETRE
// Edit file ini untuk mengubah daftar menu
// ============================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "Semua Menu", icon: "" },
  { id: "kopi", name: "Kopi", icon: "" },
  { id: "non-kopi", name: "Non-Kopi", icon: "" },
  { id: "makanan", name: "Makanan", icon: "" },
  { id: "camilan", name: "Camilan", icon: "" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Es Kopi Susu",
    description: "Perpaduan espresso, susu segar, dan gula aren yang menyegarkan",
    price: 18000,
    category: "kopi",
    image: "/images/menu/es-kopi-susu.jpg",
    isPopular: true,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Americano",
    description: "Espresso murni dengan air panas, rasa kopi yang kuat dan bersih",
    price: 15000,
    category: "kopi",
    image: "/images/menu/americano.jpg",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Cafe Latte",
    description: "Espresso lembut dengan steamed milk dan foam tipis",
    price: 22000,
    category: "kopi",
    image: "/images/menu/cafe-latte.jpg",
    isPopular: true,
    isAvailable: true,
  },
  {
    id: "4",
    name: "Cappuccino",
    description: "Espresso dengan susu dan foam tebal, taburan cokelat bubuk",
    price: 22000,
    category: "kopi",
    image: "/images/menu/cappuccino.jpg",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Matcha Latte",
    description: "Teh hijau Jepang premium dengan susu segar, manis alami",
    price: 25000,
    category: "non-kopi",
    image: "/images/menu/matcha-latte.jpg",
    isNew: true,
    isAvailable: true,
  },
  {
    id: "6",
    name: "Cokelat",
    description: "Cokelat premium dengan susu segar, cocok untuk pecinta cokelat",
    price: 20000,
    category: "non-kopi",
    image: "/images/menu/cokelat.jpg",
    isAvailable: true,
  },
  {
    id: "7",
    name: "Lemon Tea",
    description: "Teh segar dengan perasan lemon asli, dingin menyegarkan",
    price: 12000,
    category: "non-kopi",
    image: "/images/menu/lemon-tea.jpg",
    isAvailable: true,
  },
  {
    id: "8",
    name: "Kentang Goreng",
    description: "Kentang goreng renyah dengan bumbu spesial dan saus sambal",
    price: 15000,
    category: "camilan",
    image: "/images/menu/kentang-goreng.jpg",
    isPopular: true,
    isAvailable: true,
  },
  {
    id: "9",
    name: "Roti Bakar",
    description: "Roti bakar dengan selai cokelat, keju, atau kombinasi",
    price: 12000,
    category: "camilan",
    image: "/images/menu/roti-bakar.jpg",
    isAvailable: true,
  },
  {
    id: "10",
    name: "Mi Goreng",
    description: "Mi goreng spesial dengan telur, sayuran, dan bumbu rahasia",
    price: 18000,
    category: "makanan",
    image: "/images/menu/mi-goreng.jpg",
    isNew: true,
    isAvailable: true,
  },
  {
    id: "11",
    name: "Pisang Goreng",
    description: "Pisang goreng crispy dengan taburan gula halus dan saus cokelat",
    price: 10000,
    category: "camilan",
    image: "/images/menu/pisang-goreng.jpg",
    isAvailable: true,
  },
  {
    id: "12",
    name: "Nasi Goreng",
    description: "Nasi goreng dengan telur mata sapi, ayam, dan kerupuk",
    price: 20000,
    category: "makanan",
    image: "/images/menu/nasi-goreng.jpg",
    isPopular: true,
    isAvailable: true,
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
