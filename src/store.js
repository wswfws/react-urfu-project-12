import { create } from 'zustand';

export const useChatStore = create((set) => ({
  activeChannelId: 'general',
  setActiveChannel: (activeChannelId) => set({ activeChannelId }),
}));
