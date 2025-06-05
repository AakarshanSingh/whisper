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
      // Wait for auth to be loaded and ensure we have a conversation
      if (!authUser || !selectedConversation?._id) {
        console.log('Auth not loaded or no conversation selected:', { authUser: !!authUser, conversation: selectedConversation?._id });
        if (!selectedConversation?._id) {
          setMessages([]); // Clear messages when no conversation
        }
        return;
      }
      
      console.log('Fetching messages for conversation:', selectedConversation._id);
      setLoading(true);
      try {
        const whisperData = JSON.parse(localStorage.getItem('whisper'));
        if (!whisperData?.token) {
          throw new Error('No authentication token found');
        }
        
        console.log('Making request to:', `${SERVER_URL}/api/message/${selectedConversation._id}`);
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
        
        console.log('Received messages data:', data);
        if (data.error) {
          throw new Error(data.error);
        }
        
        const messagesArray = ensureMessagesArray(data);
        console.log('Setting messages array:', messagesArray);
        setMessages(messagesArray);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error(error.message);
        // If there's an auth error, the user might need to log in again
        if (error.message.includes('authentication') || error.message.includes('token') || error.message.includes('401')) {
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
