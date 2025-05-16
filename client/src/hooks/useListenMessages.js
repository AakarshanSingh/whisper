import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import { ensureMessagesArray } from '../utils/messageDebug';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      const safeMessages = ensureMessagesArray(messages);
      setMessages([...safeMessages, newMessage]);
    });
    return () => socket?.off('newMessage');
  }, [socket, setMessages, messages]);
};
export default useListenMessages;
