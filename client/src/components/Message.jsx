/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { formatMessageTime } from '../utils/formatTime';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = formatMessageTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bubbleClass = fromMe 
    ? 'bg-primary text-primary-foreground' 
    : 'bg-muted text-muted-foreground border border-border';
  
  const handleImageError = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };
  return (
    <div 
      className={`mb-4 group transition-all duration-200 ${fromMe ? 'flex justify-end' : 'flex justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`chat ${chatClassName} max-w-xs lg:max-w-md xl:max-w-lg`}>

        <div className={`chat-bubble ${bubbleClass} shadow-sm rounded-xl px-4 py-3 relative transition-all duration-200 ${
          fromMe 
            ? 'rounded-br-sm ml-auto' 
            : 'rounded-bl-sm mr-auto'
        } ${isHovered ? 'shadow-md' : ''}`}>
            {/* Message content */}
          {!message.image && (
            <div className="text-sm leading-relaxed break-words">
              {message.message}
            </div>
          )}          {/* Image loading state */}
          {message.image && !imageLoaded && (
            <div className="animate-pulse">
              <img
                src={message.imgUrl}
                hidden
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                alt="Message image"
              />
              <div className="w-52 h-40 bg-muted rounded-lg flex items-center justify-center border border-border">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              </div>
            </div>
          )}          {/* Loaded image */}
          {message.image && imageLoaded && !imageFailed && (
            <div className="relative overflow-hidden rounded-lg hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              <img
                src={message.imgUrl}
                className="max-w-48 max-h-64 w-auto h-auto object-contain rounded-md shadow-sm"
                alt="Message image"
              />
            </div>
          )}
          
          {/* Failed image */}
          {message.image && imageFailed && (
            <div className="flex flex-col items-center justify-center w-48 h-36 bg-muted rounded-lg text-destructive border border-destructive/20 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs">Failed to load</span>
            </div>
          )}
        </div>

        <div className={`chat-footer mt-1 flex items-center gap-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-70'
        } ${fromMe ? 'justify-end' : 'justify-start'}`}>
          <time className="text-xs text-muted-foreground">
            {formattedTime}
          </time>
        </div>
      </div>
    </div>
  );
};

export default Message;
