/* eslint-disable react/prop-types */
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';
import { getDefaultAvatarUrl } from '../utils/messageDebug';
import { useState } from 'react';

const Conversation = ({ conversation, lastIndex }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [imageError, setImageError] = useState(false);
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);  const handleImageError = () => {
    setImageError(true);
  };
  // Use fullName for avatars to avoid showing numbers like "6"
  const avatarUrl = imageError || !conversation.profilePic 
    ? getDefaultAvatarUrl(conversation.fullName) 
    : conversation.profilePic;

  return (
    <>
      <div
        className={`flex gap-3 items-center p-3 cursor-pointer transition-all duration-300 hover:bg-secondary hover:scale-[1.02] rounded-lg ${
          isSelected ? 'bg-gradient-to-r from-message/30 to-secondary shadow-md' : 'hover:shadow-md'
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? 'online' : ''}`}>
          <div className={`w-12 rounded-full ring ${isSelected ? 'ring-message' : 'ring-gray-600'} ${isOnline ? 'ring-offset-2 ring-offset-green-500' : ''}`}>
            <img 
              src={avatarUrl} 
              alt={conversation.fullName}
              onError={handleImageError}
              className="bg-gray-700"
            />
          </div>
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <p className={`font-bold ${isSelected ? 'text-message' : 'text-gray-200'}`}>
              {conversation.fullName}
            </p>
            
            {isOnline && (
              <span className="badge badge-xs badge-success animate-pulse"></span>
            )}
          </div>
          
          <p className="text-xs text-gray-400 truncate">
            {conversation.lastMessage || "Start a new conversation"}
          </p>
        </div>
      </div>
      
      {!lastIndex && <div className="divider my-0 py-0 h-px bg-gray-800 opacity-50" />}
    </>
  );
};

export default Conversation;
