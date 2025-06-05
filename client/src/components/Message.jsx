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
  const [isHovered, setIsHovered] = useState(false);
  
  const bubbleClass = fromMe 
    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
    : 'bg-gray-700 text-gray-100 shadow-lg border border-gray-600';
  
  const handleImageError = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };

  return (
    <div 
      className="mb-4 group transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`chat ${chatClassName} animate-slide-in`}>
        {!fromMe && (
          <div className="chat-image avatar mb-auto">
            <div className={`w-10 h-10 rounded-full ring transition-all duration-200 ${
              isHovered 
                ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-900 scale-110' 
                : 'ring-1 ring-gray-600'
            }`}>
              <img 
                src={message.senderProfilePic || getDefaultAvatarUrl(message.senderName || "User")} 
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getDefaultAvatarUrl(message.senderName || "User");
                }}
              />
            </div>
          </div>
        )}
        
        <div className={`chat-bubble ${bubbleClass} max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 relative transition-all duration-200 ${
          fromMe 
            ? 'rounded-br-md hover:shadow-blue-500/20' 
            : 'rounded-bl-md hover:shadow-gray-500/20'
        } ${isHovered ? 'shadow-xl scale-[1.02]' : ''}`}>
          
          {/* Message content */}
          {!message.image && (
            <div className="text-sm leading-relaxed break-words">
              {message.message}
            </div>
          )}
          
          {/* Image loading state */}
          {message.image && !imageLoaded && (
            <div className="animate-pulse">
              <img
                src={message.imgUrl}
                hidden
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                alt="Message image"
              />
              <div className="w-64 h-48 bg-gray-600 rounded-xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            </div>
          )}
          
          {/* Loaded image */}
          {message.image && imageLoaded && !imageFailed && (
            <div className="relative overflow-hidden rounded-xl hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
              <img
                src={message.imgUrl}
                className="max-w-64 max-h-96 object-cover shadow-md"
                alt="Message image"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200"></div>
            </div>
          )}
          
          {/* Failed image */}
          {message.image && imageFailed && (
            <div className="flex flex-col items-center justify-center w-64 h-48 bg-gray-800 rounded-xl text-red-400 border border-red-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm">Failed to load image</span>
            </div>
          )}
          
          {/* Message tail */}
          <div className={`absolute bottom-0 w-0 h-0 ${
            fromMe 
              ? 'right-0 border-l-8 border-l-blue-600 border-b-8 border-b-transparent transform translate-x-1' 
              : 'left-0 border-r-8 border-r-gray-700 border-b-8 border-b-transparent transform -translate-x-1'
          }`} />
        </div>
          <div className={`chat-footer mt-1 flex items-center gap-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}>
          <time className="text-xs text-gray-400 font-medium">
            {formattedTime}
          </time>
        </div>
      </div>
    </div>
  );
};
export default Message;
