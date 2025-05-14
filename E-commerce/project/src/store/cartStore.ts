import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Cart } from '../types';

interface CartState extends Cart {
  addItem: (item: Omit<CartItem, 'id'> & { id?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalAmount: 0,
      totalItems: 0,
      
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          (i) => i.productId === item.productId
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity,
          };
        } else {
          // New item, add to cart
          const newItem = {
            ...item,
            id: Date.now(), // Generate temporary id
          };
          updatedItems = [...state.items, newItem];
        }

        // Calculate totals
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 
          0
        );

        return { items: updatedItems, totalItems, totalAmount };
      }),
      
      removeItem: (id) => set((state) => {
        const updatedItems = state.items.filter((item) => item.id !== id);
        
        // Calculate totals
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 
          0
        );

        return { items: updatedItems, totalItems, totalAmount };
      }),
      
      updateQuantity: (id, quantity) => set((state) => {
        const updatedItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        
        // Calculate totals
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity, 
          0
        );

        return { items: updatedItems, totalItems, totalAmount };
      }),
      
      clearCart: () => set({ items: [], totalAmount: 0, totalItems: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);