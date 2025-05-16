import { useState } from 'react';
import useConversation from '../zustand/useConversation';
import { toast } from 'react-toastify';
import { SERVER_URL } from '../global';
import { ensureMessagesArray } from '../utils/messageDebug';

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message, imgUrl) => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('whisper')).token;
      const res = await fetch(
        `${SERVER_URL}/api/message/send/${selectedConversation._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, imgUrl }),
        }
      );
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const safeMessages = ensureMessagesArray(messages);
      setMessages([...safeMessages, data]);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return { sendMessage, loading };
};
export default useSendMessage;
