/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { extractTime } from '../utils/extractTime';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div>
      <div className={`chat ${chatClassName}`}>
        <div className={`chat-bubble ${fromMe && 'bg-message text-white'}`}>
          {!message.image && message.message}
          {message.image && !imageLoaded && (
            <div className="card my-1 -m-2 w-52">
              <img
                src={message.imgUrl}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt="Message image"
              />
              <div className="skeleton  w-52 h-40"></div>
            </div>
          )}
          {message.image && imageLoaded && (
            <div className="card -mx-3 -m-1 w-52">
              <img
                src={message.imgUrl}
                className="rounded-xl"
                onLoad={() => setImageLoaded(true)}
                alt="Message image"
              />
            </div>
          )}
        </div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};
export default Message;
