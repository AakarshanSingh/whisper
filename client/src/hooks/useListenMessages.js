import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import { ensureMessagesArray } from '../utils/messageDebug';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, updateConversation } = useConversation();
  
  useEffect(() => {
    socket?.on('newMessage', (data) => {
      // Handle both old format (just message) and new format (message + conversation)
      const newMessage = data.newMessage || data;
      const conversation = data.conversation;
      
      const safeMessages = ensureMessagesArray(messages);
      setMessages([...safeMessages, newMessage]);
      
      // If conversation data is available, update the conversations list
      if (conversation) {
        updateConversation(conversation);
      }
    });
    
    return () => socket?.off('newMessage');
  }, [socket, setMessages, updateConversation, messages]);
};
export default useListenMessages;
