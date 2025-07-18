import useConversation from '../zustand/useConversation';
import { getDefaultAvatarUrl } from '../utils/messageDebug';
import { formatConversationTime } from '../utils/formatTime';
import { useState } from 'react';

const Conversation = ({ conversation, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedConversation?._id === conversation._id;

  const handleImageError = () => {
    setImageError(true);
  };

  const avatarUrl =
    imageError || !conversation.profilePic
      ? getDefaultAvatarUrl(conversation.fullName)
      : conversation.profilePic;

  return (
    <>
      <div
        className={`relative flex gap-3 items-center p-3 mx-2 my-1 cursor-pointer transition-all duration-200 ease-out rounded-lg group conversation-item ${
          isSelected
            ? 'active bg-accent shadow-md border border-primary/20'
            : 'hover:bg-accent/70 hover:shadow-sm'
        }`}
        onClick={() => setSelectedConversation(conversation)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='relative'>
          <div
            className={`w-10 h-10 rounded-full transition-all duration-200 overflow-hidden border-2 ${
              isSelected
                ? 'border-primary shadow-sm'
                : isHovered
                ? 'border-border scale-105 shadow-sm'
                : 'border-border/30'
            }`}
          >
            <img
              src={avatarUrl}
              alt={conversation.fullName}
              onError={handleImageError}
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        <div className='flex flex-col flex-1 min-w-0'>
          <div className='flex justify-between items-center mb-1'>
            <p
              className={`font-semibold text-sm truncate transition-colors duration-200 ${
                isSelected ? 'text-accent-foreground' : 'text-foreground'
              }`}
            >
              {conversation.fullName}
            </p>
            <span
              className={`text-xs transition-colors duration-200 font-medium ${
                isSelected
                  ? 'text-accent-foreground/70'
                  : 'text-muted-foreground'
              }`}
            >
              {formatConversationTime(
                conversation.lastMessageAt || conversation.updatedAt
              )}
            </span>
          </div>
          <p
            className={`text-xs truncate transition-colors duration-200 ${
              isSelected ? 'text-accent-foreground/80' : 'text-muted-foreground'
            }`}
          >
            {conversation.lastMessage || 'Start a new conversation'}
          </p>
        </div>
      </div>
      {!lastIndex && <div className='mx-4 h-px bg-border/30 my-1' />}
    </>
  );
};

export default Conversation;
