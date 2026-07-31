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
  notes: string;
  addItem: (item: CartItem) => void;
  removeItem: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      notes: '',
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
      setNotes: (notes: string) => set({ notes }),
      clearCart: () => set({ items: [], notes: '' }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTax: () => {
        return 0; // Cut 18% GST (Show GST 18%: ₹0.00)
      },
      getTotal: () => {
        return get().getSubtotal();
      },
    }),
    {
      name: 'sandy-digital-hub-cart',
    }
  )
);
