import { create } from 'zustand';

function readSession() {
  try {
    return JSON.parse(localStorage.getItem('hexlet-chat.session') ?? 'null') ?? {};
  } catch {
    return {};
  }
}

export const useChatStore = create((set) => ({
  ...readSession(),
  activeChannelId: null,
  setActiveChannel: (activeChannelId) => set({ activeChannelId }),
  setSession: ({ token, username }) => {
    localStorage.setItem('hexlet-chat.session', JSON.stringify({ token, username }));
    set({ token, username, activeChannelId: null });
  },
  clearSession: () => {
    localStorage.removeItem('hexlet-chat.session');
    set({ token: null, username: null, activeChannelId: null });
  },
}));
