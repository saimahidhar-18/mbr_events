import create from 'zustand'

export const useStore = create(set => ({
  user: null,
  setUser: (u) => set({ user: u }),
  cart: [],
  addToCart: (item) => set(state => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] })
  ,
  // Admin inventory and gallery state
  inventory: [],
  setInventory: (items) => set({ inventory: items }),
  applyInventoryUpdate: (updated) => set(state => ({ inventory: state.inventory.map(i => i.id === updated.id ? updated : i) })),
  updateInventoryOptimistic: (id, patch) => set(state => ({ inventory: state.inventory.map(i => i.id === id ? { ...i, ...patch } : i) })),
  prependGalleryImages: (images) => set(state => ({ gallery: [...(state.gallery||[]), ...images] })),
  bookings: [],
  prependBooking: (booking) => set(state => ({ bookings: [booking, ...state.bookings] }))
}))
