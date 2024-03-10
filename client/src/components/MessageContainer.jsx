import { useEffect } from 'react';
import useConversation from '../zustand/useConversation';
import MessageInput from './MessageInput';
import Messages from './Messages';

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  const NoChatSelectedComp = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-4/5 flex flex-col border border-secondary">
      {!selectedConversation ? (
        <NoChatSelectedComp />
      ) : (
        <>
          <div className="bg-primary px-4 py-2 mb-2">
            <span className="text-grey-900 font-bold">
              {selectedConversation.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

export default MessageContainer;
