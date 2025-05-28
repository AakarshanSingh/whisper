import { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { BsThreeDots } from 'react-icons/bs';
import { MdPersonOutline } from 'react-icons/md';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Simulate online status check
    if (selectedConversation) {
      setIsOnline(Math.random() > 0.5);
    }
  }, [selectedConversation]);

  const NoChatSelectedComp = () => {
    return (
      <div className='flex items-center justify-center w-full h-full bg-gradient-to-br from-primary to-[#262a3b]'>
        <div className='px-6 py-8 rounded-2xl bg-secondary bg-opacity-40 backdrop-blur-sm shadow-lg text-center flex flex-col items-center gap-4 transform transition-all hover:scale-105'>
          <div className='w-20 h-20 bg-message bg-opacity-20 rounded-full flex items-center justify-center'>
            <MdPersonOutline className='w-10 h-10 text-blue-400' />
          </div>
          <div>
            <h3 className='text-2xl font-bold text-textColor mb-2'>
              No Chat Selected
            </h3>
            <p className='text-gray-300 sm:text-base md:text-lg'>
              Select a conversation from the sidebar to start messaging
            </p>
          </div>
          <div className='mt-2 w-16 h-1 bg-message rounded-full opacity-70'></div>
        </div>
      </div>
    );
  };
  return (
    <div className='flex flex-col border-l border-gray-700 overflow-hidden bg-primary h-full'>
      {!selectedConversation ? (
        <NoChatSelectedComp />
      ) : (
        <>
          <div className='bg-secondary px-4 py-3 border-b border-gray-700 flex justify-between items-center shadow-md'>
            <div className='flex items-center gap-3'>
              <div className={`avatar ${isOnline ? 'online' : ''}`}>
                <div className='w-10 rounded-full ring ring-message ring-opacity-30'>
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
              <div className='flex flex-col'>
                <span className='text-textColor font-bold'>
                  {selectedConversation.fullName}
                </span>
                <span
                  className={`text-xs ${
                    isOnline ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <button className='btn btn-sm btn-circle btn-ghost'>
              <BsThreeDots className='w-5 h-5' />
            </button>{' '}
          </div>

          <div className='flex-1 flex flex-col'>
            <Messages />
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
