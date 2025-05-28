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
  };
  return (
    <div className='flex flex-col'>
      {/* Image Preview Card */}
      <div
        className={`${
          imgUrl === '' || imgUrl === null ? 'hidden' : ''
        } mx-auto mt-4 mb-2 card w-2/3 bg-gray-800 shadow-xl border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02]`}
      >
        <div className='relative'>
          <button
            onClick={() => setImgUrl('')}
            className='absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 rounded-full p-1 text-white transition-colors'
          >
            <AiOutlineClose size={16} />
          </button>
          <figure className='px-4 pt-4'>
            <img
              src={imgUrl}
              alt='Image'
              className='rounded-xl w-full object-cover max-h-64'
            />
          </figure>
        </div>
        <div className='card-body pt-2 pb-4'>
          <div className='card-actions justify-end'>
            <button
              className='btn btn-sm bg-message hover:bg-blue-600 text-white border-none shadow-lg transition-all duration-300 transform hover:-translate-y-0.5'
              onClick={handleSendImage}
              disabled={loading}
            >
              {loading ? (
                <div className='loading loading-spinner loading-xs' />
              ) : (
                <div className='flex items-center gap-2'>
                  <span>Send Image</span>
                  <IoMdSend className='h-4 w-4' />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message Input Bar */}
      <div className='flex items-center bg-secondary bg-opacity-50 mx-4 mb-4 rounded-full shadow-lg'>
        <div className='flex items-center gap-2 ml-4'>
          <button
            type='button'
            className='p-2 rounded-full hover:bg-primary transition-colors'
            onClick={() => imageRef.current.click()}
          >
            <BsFillImageFill
              size={20}
              className='text-message hover:text-blue-400 transition-colors'
            />
          </button>
          <button
            type='button'
            className='p-2 rounded-full hover:bg-primary transition-colors'
          >
            <BsEmojiSmile
              size={20}
              className='text-message hover:text-blue-400 transition-colors'
            />
          </button>
          <button
            type='button'
            className='p-2 rounded-full hover:bg-primary transition-colors'
          >
            <RiAttachment2
              size={22}
              className='text-message hover:text-blue-400 transition-colors'
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

        <form className='px-2 py-2 flex-1' onSubmit={handleSubmit}>
          <div className='w-full relative'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Type a message...'
              className='border-none text-sm rounded-full block w-full py-2.5 px-4 bg-primary text-textColor focus:ring-1 focus:ring-message focus:outline-none transition-all'
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />{' '}
            <button
              type='submit'
              className='absolute inset-y-0 end-0 flex items-center pr-3 rounded-full'
              disabled={!message.trim() && !loading}
            >
              {loading ? (
                <div className='loading loading-spinner loading-sm text-message' />
              ) : (
                <IoMdSend
                  className={`h-6 w-6 ${
                    message.trim() ? 'text-message' : 'text-gray-500'
                  } transition-colors hover:scale-110`}
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
