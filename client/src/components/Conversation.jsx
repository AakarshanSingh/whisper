/* eslint-disable react/prop-types */
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
  
  // Use fullName for avatars to avoid showing numbers like "6"
  const avatarUrl = imageError || !conversation.profilePic 
    ? getDefaultAvatarUrl(conversation.fullName) 
    : conversation.profilePic;
  return (
    <>
      <div
        className={`relative flex gap-3 items-center p-4 mx-2 cursor-pointer transition-all duration-200 ease-in-out rounded-xl group ${
          isSelected 
            ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-l-4 border-blue-500' 
            : 'hover:bg-gray-800/50 hover:translate-x-1'
        }`}
        onClick={() => setSelectedConversation(conversation)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="avatar relative">
          <div className={`w-14 h-14 rounded-full transition-all duration-200 ${
            isSelected 
              ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
              : isHovered 
                ? 'ring-2 ring-gray-600 ring-offset-1 ring-offset-gray-900 scale-105' 
                : 'ring-1 ring-gray-700'
          }`}>
            <img 
              src={avatarUrl} 
              alt={conversation.fullName}
              onError={handleImageError}
              className="w-full h-full object-cover rounded-full bg-gray-700"
            />
          </div>
        </div>
          <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <p className={`font-semibold text-base truncate transition-colors duration-200 ${
              isSelected ? 'text-blue-400' : 'text-gray-100'
            }`}>
              {conversation.fullName}
            </p>
              <span className="text-xs text-gray-500">
              {formatConversationTime(conversation.lastMessageAt || conversation.updatedAt)}
            </span>
          </div>
          
          <p className={`text-sm truncate transition-colors duration-200 ${
            isSelected ? 'text-gray-300' : 'text-gray-400'
          }`}>
            {conversation.lastMessage || "Start a new conversation"}
          </p>
        </div>

        {/* Hover indicator */}
        <div className={`absolute right-3 transition-all duration-200 ${
          isHovered && !isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      </div>
      
      {!lastIndex && (
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent opacity-50" />
      )}
    </>
  );
};

export default Conversation;
