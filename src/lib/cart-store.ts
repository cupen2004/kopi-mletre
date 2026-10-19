import { create } from "zustand";
import { MenuItem } from "./menu-data";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

interface CartStore {
  items: CartItem[];
  tableNumber: string;
  customerName: string;
  paymentMethod: string;
  orderNotes: string;
  
  setTableNumber: (table: string) => void;
  setCustomerName: (name: string) => void;
  setPaymentMethod: (method: string) => void;
  setOrderNotes: (notes: string) => void;
  
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tableNumber: "",
  customerName: "",
  paymentMethod: "",
  orderNotes: "",

  setTableNumber: (table) => set({ tableNumber: table }),
  setCustomerName: (name) => set({ customerName: name }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setOrderNotes: (notes) => set({ orderNotes: notes }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItem.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { menuItem: item, quantity: 1, notes: "" }],
      };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.menuItem.id !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.menuItem.id !== itemId) };
      }
      return {
        items: state.items.map((i) =>
          i.menuItem.id === itemId ? { ...i, quantity } : i
        ),
      };
    }),

  updateItemNotes: (itemId, notes) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === itemId ? { ...i, notes } : i
      ),
    })),

  clearCart: () =>
    set({ items: [], customerName: "", paymentMethod: "", orderNotes: "" }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );
  },
}));
