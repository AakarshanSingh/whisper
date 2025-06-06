import { create } from 'zustand';
import { ensureMessagesArray } from '../utils/messageDebug';

const getStoredConversation = () => {
  try {
    const stored = localStorage.getItem('selectedConversation');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing stored conversation:', error);
    localStorage.removeItem('selectedConversation');
    return null;
  }
};

const useConversation = create((set, get) => ({  selectedConversation: getStoredConversation(),
  setSelectedConversation: (selectedConversation) => {
    set({ selectedConversation, messages: [] });

    if (selectedConversation) {
      localStorage.setItem(
        'selectedConversation',
        JSON.stringify(selectedConversation)
      );
    } else {
      localStorage.removeItem('selectedConversation');
    }
  },  messages: [],
  setMessages: (messages) => {
    set({ messages: ensureMessagesArray(messages) });
  },
  conversations: [],
  setConversations: (conversations) => {
    set({ conversations });
  },
  updateConversation: (updatedConversation) => {
    const { conversations } = get();
    const updatedConversations = conversations.map((conv) =>
      conv._id === updatedConversation._id ? updatedConversation : conv
    );

    if (!conversations.find((conv) => conv._id === updatedConversation._id)) {
      updatedConversations.unshift(updatedConversation); // Add to beginning for newest first
    }
    set({ conversations: updatedConversations });
  },
}));

export default useConversation;
