import useConversation from '../zustand/useConversation';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { User } from 'lucide-react';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  const NoChatSelectedComp = () => {
    return (
      <div className='flex items-center justify-center w-full h-full bg-background/50'>
        <div className='bg-card/80 backdrop-blur-sm border border-border/30 px-8 py-12 rounded-2xl text-center flex flex-col items-center gap-6 max-w-md shadow-2xl'>
          <div className='w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center shadow-inner'>
            <User className='w-12 h-12 text-muted-foreground' />
          </div>
          <div className='space-y-3'>
            <h3 className='text-3xl font-bold text-foreground tracking-wide'>
              No Chat Selected
            </h3>
            <p className='text-muted-foreground text-base leading-relaxed max-w-sm'>
              Select a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className='flex flex-col h-full bg-background/50 overflow-hidden'>
      {!selectedConversation ? (
        <NoChatSelectedComp />
      ) : (
        <>
          {' '}
          {/* Chat Header */}
          <div className='flex-shrink-0 bg-card/90 backdrop-blur-md px-4 py-3 border-b border-border/30 flex items-center shadow-sm'>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              <div className='avatar transition-all duration-300 flex-shrink-0'>
                <div className='w-10 h-10 rounded-full border-2 border-border/30 overflow-hidden shadow-sm'>
                  <img
                    className='w-full h-full object-cover'
                    src={
                      selectedConversation.profilePic ||
                      getDefaultAvatarUrl(selectedConversation.fullName)
                    }
                    alt='avatar'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getDefaultAvatarUrl(
                        selectedConversation.fullName
                      );
                    }}
                  />
                </div>
              </div>
              <div className='flex flex-col min-w-0 flex-1'>
                <span className='text-foreground font-bold text-base truncate'>
                  {selectedConversation.fullName}
                </span>
                <span className='text-muted-foreground text-xs font-medium'>
                  Online
                </span>
              </div>
            </div>
          </div>
          {/* Messages Area */}
          <div className='flex-1 flex flex-col min-h-0 overflow-hidden'>
            <div className='flex-1 overflow-hidden'>
              <Messages />
            </div>
            <div className='flex-shrink-0'>
              <MessageInput />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
