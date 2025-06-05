import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SERVER_URL } from '../global';
import useConversation from '../zustand/useConversation';

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const { conversations, setConversations } = useConversation();
  
  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const token = JSON.parse(localStorage.getItem('whisper')).token;
        const res = await fetch(`${SERVER_URL}/api/users/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, [setConversations]);
  
  return { loading, conversations };
};
export default useGetConversations;
