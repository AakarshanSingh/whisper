import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import { toast } from 'react-toastify';
import { SERVER_URL } from '../global';

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem('whisper')).token;
        const res = await fetch(
          `${SERVER_URL}/api/message/${selectedConversation._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);
  return { messages, loading };
};
export default useGetMessages;
