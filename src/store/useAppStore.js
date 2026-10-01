import { create } from 'zustand';

let actionTimer;

export const useAppStore = create((set) => ({
  // Auth state
  user: null,
  isAuthenticated: false,

  // UI state
  actionMessage: '',
  notifications: [],

  // Auth actions
  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),

  register: (userData) => set({
    user: userData,
    isAuthenticated: true,
  }),

  // UI actions
  showAction: (message, duration = 2600) => {
    window.clearTimeout(actionTimer);
    set({ actionMessage: message });
    actionTimer = window.setTimeout(() => set({ actionMessage: '' }), duration);
  },
  addNotification: (notification) => set((state) => ({
    notifications: [{ id: Date.now(), ...notification }, ...state.notifications],
  })),
  clearNotifications: () => set({ notifications: [] }),
}));
