import { create } from 'zustand';
import { ensureMessagesArray } from '../utils/messageDebug';

// Helper function to safely get from localStorage
const getStoredConversation = () => {
  try {
    const stored = localStorage.getItem('selectedConversation');
    console.log('Restoring conversation from localStorage:', stored);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing stored conversation:', error);
    localStorage.removeItem('selectedConversation');
    return null;
  }
};

const useConversation = create((set, get) => ({
  selectedConversation: getStoredConversation(), // Restore from localStorage on init
  setSelectedConversation: (selectedConversation) => {
    console.log('Setting selected conversation:', selectedConversation);
    // Clear messages when switching conversations
    set({ selectedConversation, messages: [] });
    // Only persist if it's not null
    if (selectedConversation) {
      localStorage.setItem('selectedConversation', JSON.stringify(selectedConversation));
    } else {
      localStorage.removeItem('selectedConversation');
    }
  },
  messages: [],
  setMessages: (messages) => {
    console.log('Setting messages in store:', messages);
    set({ messages: ensureMessagesArray(messages) });
  },
  conversations: [],
  setConversations: (conversations) => {
    console.log('Setting conversations in store:', conversations);
    set({ conversations });
  },
  updateConversation: (updatedConversation) => {
    const { conversations } = get();
    const updatedConversations = conversations.map(conv => 
      conv._id === updatedConversation._id ? updatedConversation : conv
    );
    // If the conversation is new, add it to the list
    if (!conversations.find(conv => conv._id === updatedConversation._id)) {
      updatedConversations.unshift(updatedConversation); // Add to beginning for newest first
    }
    set({ conversations: updatedConversations });
  },
}));

export default useConversation;
