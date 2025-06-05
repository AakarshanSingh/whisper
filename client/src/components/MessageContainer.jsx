import useConversation from '../zustand/useConversation';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { MdPersonOutline } from 'react-icons/md';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  const NoChatSelectedComp = () => {
    return (
      <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-primary via-[#262a3b] to-[#1d1f2b]'>
        <div className='px-8 py-10 rounded-3xl bg-secondary bg-opacity-60 backdrop-blur-md shadow-2xl text-center flex flex-col items-center gap-6 transform transition-all hover:scale-105 hover:bg-opacity-70 border border-gray-600 border-opacity-30'>
          <div className='w-24 h-24 bg-gradient-to-br from-message to-blue-600 bg-opacity-20 rounded-full flex items-center justify-center shadow-lg'>
            <MdPersonOutline className='w-12 h-12 text-blue-400' />
          </div>
          <div>
            <h3 className='text-3xl font-bold text-textColor mb-3 tracking-wide'>
              No Chat Selected
            </h3>
            <p className='text-gray-300 text-lg leading-relaxed max-w-sm'>
              Select a conversation from the sidebar to start messaging
            </p>
          </div>          <div className='mt-4 w-20 h-1 bg-gradient-to-r from-transparent via-message to-transparent rounded-full opacity-80'></div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full bg-primary overflow-hidden'>
      {!selectedConversation ? (
        <NoChatSelectedComp />
      ) : (
        <>
          {' '}          {/* Chat Header */}
          <div className='flex-shrink-0 bg-secondary px-6 py-4 border-b border-gray-700 flex items-center shadow-lg backdrop-blur-sm'>
            <div className='flex items-center gap-4 min-w-0 flex-1'>
              <div className='avatar transition-all duration-300 flex-shrink-0'>
                <div className='w-12 rounded-full ring-2 ring-message ring-opacity-40 hover:ring-opacity-60 transition-all'>
                  <img
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
                <span className='text-textColor font-bold text-lg truncate'>
                  {selectedConversation.fullName}
                </span>
              </div>
            </div>          </div>
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
