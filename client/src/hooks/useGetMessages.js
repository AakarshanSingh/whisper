import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import { toast } from 'react-toastify';
import { SERVER_URL } from '../global';
import { ensureMessagesArray } from '../utils/messageDebug';
import { useAuthContext } from '../context/AuthContext';

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getMessages = async () => {
      if (!authUser || !selectedConversation?._id) {
        if (!selectedConversation?._id) {
          setMessages([]);
        }
        return;
      }

      setLoading(true);
      try {
        const whisperData = JSON.parse(localStorage.getItem('whisper'));
        if (!whisperData?.token) {
          throw new Error('No authentication token found');
        }

        const res = await fetch(
          `${SERVER_URL}/api/message/${selectedConversation._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${whisperData.token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const messagesArray = ensureMessagesArray(data);
        setMessages(messagesArray);
      } catch (error) {
        toast.error(error.message);
        if (
          error.message.includes('authentication') ||
          error.message.includes('token') ||
          error.message.includes('401')
        ) {
          localStorage.removeItem('whisper');
          localStorage.removeItem('selectedConversation');
          window.location.reload();
        }
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, setMessages, authUser]);

  return { messages, loading };
};

export default useGetMessages;
