import { useRef, useState, useEffect } from 'react';
import { IoMdSend } from 'react-icons/io';
import useSendMessage from '../hooks/useSendMessage';
import { BsFillImageFill, BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { RiAttachment2 } from 'react-icons/ri';
import usePreviewImage from '../hooks/usePreviewImage';
import { toast } from 'react-toastify';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  let { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  // Animation for typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(typingTimeout);
  }, [message]);
  const handleSendImage = async (e) => {
    e.preventDefault();
    if (!imgUrl) {
      toast.error('No image selected');
      return;
    }
    try {
      toast.info('Sending image...');
      await sendMessage('', imgUrl);
      setImgUrl('');
      toast.success('Image sent successfully!');
    } catch (error) {
      toast.error('Failed to send image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }
    try {
      await sendMessage(message, '');
      setMessage('');
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };  return (
    <div className='bg-secondary border-t border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm'>
      {/* Image Preview Card */}
      {imgUrl && (
        <div className="mx-4 mt-3 mb-2 bg-gray-800/90 rounded-2xl border border-gray-600/50 overflow-hidden shadow-xl backdrop-blur-sm">
          <div className='relative'>
            <button
              onClick={() => setImgUrl('')}
              className='absolute top-3 right-3 z-10 bg-red-500/90 hover:bg-red-500 rounded-full p-2 text-white transition-all duration-200 shadow-lg hover:scale-110'
            >
              <AiOutlineClose size={14} />
            </button>
            <div className='p-4'>
              <img
                src={imgUrl}
                alt='Image preview'
                className='rounded-xl w-full object-cover max-h-48 shadow-md'
              />
            </div>
          </div>
          <div className='px-4 pb-4'>
            <div className='flex justify-end'>
              <button
                className='bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg font-medium flex items-center gap-2'
                onClick={handleSendImage}
                disabled={loading}
              >
                {loading ? (
                  <div className='loading loading-spinner loading-xs' />
                ) : (
                  <>
                    <span>Send Image</span>
                    <IoMdSend className='h-4 w-4' />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input Bar */}
      <div className='flex items-end gap-3 p-4'>
        {/* Action Buttons */}
        <div className='flex items-center gap-1 mb-2'>
          <button
            type='button'
            className='p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 hover:scale-110 group'
            onClick={() => imageRef.current.click()}
            title="Send Image"
          >
            <BsFillImageFill
              size={20}
              className='text-gray-400 group-hover:text-blue-400 transition-colors duration-200'
            />
          </button>
          <button
            type='button'
            className='p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 hover:scale-110 group'
            title="Emoji"
          >
            <BsEmojiSmile
              size={20}
              className='text-gray-400 group-hover:text-yellow-400 transition-colors duration-200'
            />
          </button>
          <button
            type='button'
            className='p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 hover:scale-110 group'
            title="Attach File"
          >
            <RiAttachment2
              size={20}
              className='text-gray-400 group-hover:text-green-400 transition-colors duration-200'
            />
          </button>
          <input
            type='file'
            className='hidden'
            ref={imageRef}
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>

        {/* Message Input Form */}
        <form className='flex-1 flex items-end' onSubmit={handleSubmit}>
          <div className='flex-1 relative'>
            <div className='relative bg-gray-800/70 rounded-3xl border border-gray-600/50 shadow-lg hover:border-gray-500/50 transition-all duration-200 focus-within:border-blue-500/50 focus-within:shadow-blue-500/10 focus-within:shadow-xl backdrop-blur-sm'>
              <textarea
                ref={inputRef}
                placeholder='Type a message...'
                className='w-full py-4 px-6 bg-transparent text-gray-100 rounded-3xl focus:outline-none resize-none max-h-32 min-h-[56px] placeholder-gray-400 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent'
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                rows={1}
                style={{ 
                  height: 'auto',
                  minHeight: '56px',
                  maxHeight: '128px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              {/* Typing indicator */}
              {isTyping && message && (
                <div className='absolute bottom-1 left-6 text-xs text-blue-400 opacity-75'>
                  typing...
                </div>
              )}
            </div>
          </div>
          
          {/* Send Button */}
          <button
            type='submit'
            className={`ml-3 p-3 rounded-full transition-all duration-200 shadow-lg ${
              message.trim() 
                ? 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-110 shadow-blue-500/30' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!message.trim() || loading}
            title="Send Message"
          >
            {loading ? (
              <div className='loading loading-spinner loading-sm' />
            ) : (
              <IoMdSend className='h-5 w-5' />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
