import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem, MENU_ITEMS, CATEGORIES, Category } from "./menu-data";
import { SHOP_CONFIG, DEFAULT_TABLES } from "./config";

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  items: {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    notes: string;
  }[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  orderNotes: string;
  orderStatus: "waiting" | "confirmed" | "processing" | "ready" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "pending" | "paid";
  createdAt: string;
  updatedAt: string;
}

export interface TableConfig {
  id: string;
  name: string;
  isActive: boolean;
}

interface AdminStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  menuItems: MenuItem[];
  categories: Category[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuAvailability: (id: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["orderStatus"]) => void;
  updatePaymentStatus: (id: string, status: Order["paymentStatus"]) => void;

  tables: TableConfig[];
  addTable: (table: TableConfig) => void;
  updateTable: (id: string, table: Partial<TableConfig>) => void;
  deleteTable: (id: string) => void;

  shopConfig: typeof SHOP_CONFIG;
  updateShopConfig: (config: Partial<typeof SHOP_CONFIG>) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,

      login: (username, password) => {
        if (username === "admin" && password === "admin123") {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      menuItems: MENU_ITEMS,
      categories: CATEGORIES,

      addMenuItem: (item) =>
        set((state) => ({ menuItems: [...state.menuItems, item] })),

      updateMenuItem: (id, updates) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      deleteMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((item) => item.id !== id),
        })),

      toggleMenuAvailability: (id) =>
        set((state) => ({
          menuItems: state.menuItems.map((item) =>
            item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
          ),
        })),

      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id && c.id !== "all"),
        })),

      orders: [],

      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, orderStatus: status, updatedAt: new Date().toISOString() }
              : order
          ),
        })),

      updatePaymentStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, paymentStatus: status, updatedAt: new Date().toISOString() }
              : order
          ),
        })),

      tables: DEFAULT_TABLES,

      addTable: (table) =>
        set((state) => ({ tables: [...state.tables, table] })),

      updateTable: (id, updates) =>
        set((state) => ({
          tables: state.tables.map((table) =>
            table.id === id ? { ...table, ...updates } : table
          ),
        })),

      deleteTable: (id) =>
        set((state) => ({
          tables: state.tables.filter((table) => table.id !== id),
        })),

      shopConfig: SHOP_CONFIG,

      updateShopConfig: (config) =>
        set((state) => ({
          shopConfig: { ...state.shopConfig, ...config },
        })),
    }),
    {
      name: "kopi-mletre-admin",
    }
  )
);
