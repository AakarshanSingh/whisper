import { useEffect, useRef } from 'react';
import useGetMessages from '../hooks/useGetMessages';
import Message from './Message';
import MessageSkeleton from './MessageSkeleton';
import useListenMessages from '../hooks/useListenMessages';
import { ensureMessagesArray } from '../utils/messageDebug';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();
  
  // Ensure messages is always an array before rendering
  const safeMessages = ensureMessagesArray(messages);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeMessages]);
  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        safeMessages.length > 0 &&
        safeMessages.map((message) => {
          return (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          );
        })}      {loading &&
        [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)}

      {!loading && safeMessages.length === 0 && (
        <p className="text-center mt-20">
          Send a message to start conversation
        </p>
      )}
    </div>
  );
};
export default Messages;
