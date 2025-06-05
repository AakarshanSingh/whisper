import { useEffect, useRef, useState } from 'react';
import useGetMessages from '../hooks/useGetMessages';
import Message from './Message';
import MessageSkeleton from './MessageSkeleton';
import useListenMessages from '../hooks/useListenMessages';
import { ensureMessagesArray } from '../utils/messageDebug';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  useListenMessages();
  const lastMessageRef = useRef();
  const containerRef = useRef();
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Ensure messages is always an array before rendering
  const safeMessages = ensureMessagesArray(messages);
  
  console.log('Messages component render - loading:', loading, 'messages count:', safeMessages.length);

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
    };  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto overflow-x-hidden px-3 py-4 bg-background/30 relative"
    >{showScrollButton && (
        <Button 
          onClick={scrollToBottom}
          size="sm"
          className="absolute bottom-6 right-6 z-10 bg-primary/20 hover:bg-primary/30 rounded-full p-2 h-10 w-10 shadow-lg"
        >
          <ChevronDown size={18} />
        </Button>
      )}
      
      {/* Message List */}
      <div className="space-y-3">
        {!loading && safeMessages.length > 0 && (
          <>
            {safeMessages.map((message, index) => (
              <div key={message._id} className="relative animate-slide-up" ref={index === safeMessages.length - 1 ? lastMessageRef : null}>                {renderMessageDate(message, index) && (
                  <div className="flex justify-center my-6">
                    <span className="bg-muted/80 px-4 py-1.5 rounded-full text-xs text-muted-foreground font-medium border border-border/30 shadow-sm">
                      {new Date(message.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                <Message message={message} />
              </div>
            ))}
          </>
        )}
        
        {loading && (
          <div className="space-y-4 py-4">
            {[...Array(3)].map((_, index) => (
              <MessageSkeleton key={index} />
            ))}
          </div>
        )}        {!loading && safeMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 border border-border/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-foreground mb-2">
              No messages yet
            </p>
            <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
              Send your first message to start the conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Messages;
