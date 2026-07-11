import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  serviceId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.serviceId === item.serviceId);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (serviceId) => {
        set((state) => ({
          items: state.items.filter((i) => i.serviceId !== serviceId),
        }));
      },
      updateQuantity: (serviceId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.serviceId === serviceId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTax: () => {
        const subtotal = get().getSubtotal();
        return subtotal * 0.18; // 18% GST
      },
      getTotal: () => {
        return get().getSubtotal() + get().getTax();
      },
    }),
    {
      name: 'sandy-digital-hub-cart',
    }
  )
);
