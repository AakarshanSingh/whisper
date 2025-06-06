import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import { ensureMessagesArray } from '../utils/messageDebug';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, updateConversation } = useConversation();

  useEffect(() => {
    socket?.on('newMessage', (data) => {
      const newMessage = data.newMessage || data;
      const conversation = data.conversation;

      const safeMessages = ensureMessagesArray(messages);
      setMessages([...safeMessages, newMessage]);

      if (conversation) {
        updateConversation(conversation);
      }
    });

    return () => socket?.off('newMessage');
  }, [socket, setMessages, updateConversation, messages]);
};

export default useListenMessages;
