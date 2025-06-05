import { useRef, useState } from 'react';
import { Send, Image, X } from 'lucide-react';
import useSendMessage from '../hooks/useSendMessage';
import usePreviewImage from '../hooks/usePreviewImage';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { loading, sendMessage } = useSendMessage();
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  let { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();
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
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };  return (
    <div className='bg-card border-t border-border/50'>
      {/* Image Preview Card */}
      {imgUrl && (
        <div className="mx-3 mt-3 mb-2 bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fadeIn">
          <div className='relative'>
            <Button
              onClick={() => setImgUrl('')}
              size="sm"
              variant="destructive"
              className='absolute top-2 right-2 z-10 h-6 w-6 p-0 shadow-sm'
            >
              <X size={12} />
            </Button>
            <div className='p-3'>
              <img
                src={imgUrl}
                alt='Image preview'
                className='rounded-lg w-full h-auto object-contain max-h-48'
              />
            </div>
          </div>
          <div className='px-3 pb-3 pt-1'>
            <div className='flex justify-end'>
              <Button
                onClick={handleSendImage}
                disabled={loading}
                size="sm"
                className='px-3 py-1.5 flex items-center gap-1.5 text-sm'
              >
                {loading ? (
                  <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground' />
                ) : (
                  <>
                    <span>Send Image</span>
                    <Send className='h-3 w-3' />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input Bar */}
      <div className='flex items-end gap-2 px-3 py-2'>
        {/* Action Buttons */}
        <div className='flex items-center'>
          <Button
            type='button'
            variant="ghost"
            size="icon"
            className='h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors'
            onClick={() => imageRef.current.click()}
            title="Send Image"
          >
            <Image size={18} />
          </Button>
          <input
            type='file'
            className='hidden'
            ref={imageRef}
            accept='image/*'
            onChange={handleImageChange}
          />
        </div>

        {/* Message Input Form */}
        <form className='flex-1 flex items-end gap-2' onSubmit={handleSubmit}>
          <div className='flex-1 relative'>
            <div className='relative bg-background rounded-lg border border-border shadow-sm hover:border-ring transition-all duration-200 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/20'>
              <textarea
                ref={inputRef}
                placeholder='Type a message...'
                className='w-full py-2 px-3 bg-transparent text-foreground rounded-lg focus:outline-none resize-none max-h-24 min-h-[36px] placeholder-muted-foreground text-sm'
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                rows={1}
                style={{ 
                  height: 'auto',
                  minHeight: '36px',
                  maxHeight: '96px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                }}
              />
            </div>
          </div>
          
          {/* Send Button */}
          <Button
            type='submit'
            variant={message.trim() ? "default" : "secondary"}
            size="icon"
            className='h-8 w-8 rounded-full shadow-sm hover:scale-105 transition-transform'
            disabled={!message.trim() || loading}
            title="Send Message"
          >
            {loading ? (
              <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground' />
            ) : (
              <Send className='h-3 w-3' />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
