/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { extractTime } from '../utils/extractTime';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  
  const bubbleClass = fromMe 
    ? 'bg-gradient-to-r from-blue-500 to-message text-white shadow-md' 
    : 'bg-secondary text-white shadow-md';
  
  const handleImageError = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };
  return (
    <div className="my-2 group hover:opacity-95 transition-opacity">
      <div className={`chat ${chatClassName} animate-fade-in`}>        {!fromMe && (
          <div className="chat-image avatar">
            <div className="w-8 rounded-full ring ring-message ring-offset-base-100 ring-offset-1 transform group-hover:scale-110 transition-transform">
              <img 
                src={message.senderProfilePic || getDefaultAvatarUrl(message.senderName || "User")} 
                alt="avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getDefaultAvatarUrl(message.senderName || "User");
                }}
              />
            </div>
          </div>
        )}
        <div className={`chat-bubble ${bubbleClass} rounded-2xl transform transition-all duration-200 ${fromMe ? 'group-hover:translate-x-[-2px]' : 'group-hover:translate-x-[2px]'}`}>
          {!message.image && (
            <div className="px-1 py-0.5">{message.message}</div>
          )}
          {message.image && !imageLoaded && (
            <div className="card my-1 -m-1 animate-pulse">
              <img
                src={message.imgUrl}
                hidden
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                alt="Message image"
              />
              <div className="skeleton w-64 h-48 rounded-xl"></div>
            </div>
          )}
          {message.image && imageLoaded && !imageFailed && (
            <div className="card p-0.5 hover:scale-105 transition-transform duration-200">
              <img
                src={message.imgUrl}
                className="rounded-xl max-w-64 max-h-96 object-cover shadow-lg"
                alt="Message image"
              />
            </div>
          )}
          {message.image && imageFailed && (
            <div className="flex flex-col items-center justify-center w-64 h-48 bg-gray-800 rounded-xl text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="mt-2 text-sm">Image failed to load</span>
            </div>
          )}
        </div>
        <div className="chat-footer opacity-70 text-xs flex gap-1 items-center">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
export default Message;
