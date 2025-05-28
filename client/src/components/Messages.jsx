import { useEffect, useRef, useState } from 'react';
import useGetMessages from '../hooks/useGetMessages';
import Message from './Message';
import MessageSkeleton from './MessageSkeleton';
import useListenMessages from '../hooks/useListenMessages';
import { ensureMessagesArray } from '../utils/messageDebug';
import { IoIosArrowDown } from 'react-icons/io';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();
  const containerRef = useRef();
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Ensure messages is always an array before rendering
  const safeMessages = ensureMessagesArray(messages);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeMessages]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };
    
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderMessageDate = (message, index) => {
    if (index === 0) return true;
    
    const currentDate = new Date(message.createdAt).toDateString();
    const prevDate = new Date(safeMessages[index - 1].createdAt).toDateString();
    
    return currentDate !== prevDate;
  };
  
  return (
    <div 
      ref={containerRef}
      className="px-4 flex-1 overflow-auto relative scroll-smooth bg-gradient-to-b from-primary to-[#262a3b]"
    >
      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-5 right-5 z-10 bg-message hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-300 animate-bounce"
        >
          <IoIosArrowDown size={20} />
        </button>
      )}
      
      {/* Message List */}
      <div className="py-4 space-y-1">
        {!loading && safeMessages.length > 0 && (
          <>
            {safeMessages.map((message, index) => (
              <div key={message._id} className="relative" ref={index === safeMessages.length - 1 ? lastMessageRef : null}>
                {renderMessageDate(message, index) && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 rounded-full bg-gray-700 bg-opacity-60 text-xs text-gray-300">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <Message message={message} />
              </div>
            ))}
          </>
        )}
        
        {loading && (
          <div className="space-y-4 py-2">
            {[...Array(3)].map((_, index) => (
              <MessageSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && safeMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-message">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-200">
              No messages yet
            </p>
            <p className="text-gray-400 mt-2">
              Send your first message to start the conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Messages;
