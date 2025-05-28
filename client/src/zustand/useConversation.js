import { create } from 'zustand';
import { ensureMessagesArray } from '../utils/messageDebug';

const useConversation = create((set) => ({
  selectedConversation: null,  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages: ensureMessagesArray(messages) }),
}));

export default useConversation;
