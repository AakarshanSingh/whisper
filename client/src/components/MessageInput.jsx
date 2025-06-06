import { useRef, useState } from 'react';
import { Send, Image, X } from 'lucide-react';
import useSendMessage from '../hooks/useSendMessage';
import usePreviewImage from '../hooks/usePreviewImage';
import { toast } from 'react-toastify';
import { Button } from './ui/Button';
import { Dialog, DialogContent } from './ui/Dialog';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  let { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  const MAX_CHAR_LIMIT = 2500;
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
      setShowImageModal(false);
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
    if (message.length > MAX_CHAR_LIMIT) {
      toast.error(
        `Message too long! Maximum ${MAX_CHAR_LIMIT} characters allowed.`
      );
      return;
    }
    try {
      await sendMessage(message, '');
      setMessage('');
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_CHAR_LIMIT) {
      toast.error(`Maximum ${MAX_CHAR_LIMIT} characters allowed!`);
      return;
    }
    setMessage(value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        // Ctrl+Enter: Add new line
        return; // Let the default behavior handle the new line
      } else if (!e.shiftKey) {
        // Enter without Shift: Send message
        e.preventDefault();
        handleSubmit(e);
      }
      // Shift+Enter: Default behavior (new line)
    }
  };
  const handleImageSelect = () => {
    if (imgUrl) {
      setShowImageModal(true);
    } else {
      imageRef.current?.click();
    }
  };

  // Modified handleImageChange to automatically show modal when image is selected
  const handleImageChangeWrapper = (e) => {
    handleImageChange(e);
    // Use setTimeout to ensure imgUrl is updated before checking
    setTimeout(() => {
      if (e.target.files && e.target.files[0]) {
        setShowImageModal(true);
      }
    }, 100);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const removeImage = () => {
    setImgUrl('');
    setShowImageModal(false);
  };
  return (
    <>
      {' '}
      {/* WhatsApp/Telegram Style Image Modal */}
      <Dialog open={showImageModal} onOpenChange={closeImageModal}>
        <DialogContent className='w-[85vw] h-[80vh] max-w-4xl p-0 bg-black/95 backdrop-blur-sm border border-border/20 rounded-lg overflow-hidden'>
          <div className='relative w-full h-full flex flex-col'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-white/10 flex-shrink-0'>
              <h3 className='text-white font-medium'>Send Image</h3>
              <Button
                onClick={closeImageModal}
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/10 h-8 w-8'
              >
                <X size={20} />
              </Button>
            </div>
            {/* Image Container */}
            <div className='flex-1 flex items-center justify-center p-6 min-h-0'>
              <img
                src={imgUrl}
                alt='Preview'
                className='max-w-full max-h-full object-contain rounded-lg shadow-2xl'
              />
            </div>{' '}
            {/* Footer Actions */}
            <div className='flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-t border-white/10 flex-shrink-0'>
              <Button
                onClick={removeImage}
                variant='destructive'
                className='px-6 py-2'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendImage}
                disabled={loading}
                className='px-6 py-2 bg-primary hover:bg-primary/90'
              >
                {loading ? (
                  <div className='flex items-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <span>Send</span>
                    <Send size={16} />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className='bg-card border-t border-border/50'>
        {/* Message Input Bar */}
        <div className='flex items-center gap-3 px-4 py-3'>
          {/* Image Button */}
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className={`h-10 w-10 rounded-full transition-colors ${
              imgUrl
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={handleImageSelect}
            title={imgUrl ? 'View selected image' : 'Select image'}
          >
            <Image size={20} />
            {imgUrl && (
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-card'></div>
            )}
          </Button>{' '}
          <input
            type='file'
            className='hidden'
            ref={imageRef}
            accept='image/*'
            onChange={handleImageChangeWrapper}
          />
          <form className='flex-1 flex items-end gap-3' onSubmit={handleSubmit}>
            <div className='flex-1 relative'>
              <div className='relative bg-background rounded-2xl border border-border shadow-sm hover:border-ring transition-all duration-200 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/20'>
                <textarea
                  ref={inputRef}
                  placeholder='Type a message...'
                  className='w-full py-3 px-4 bg-transparent text-foreground rounded-2xl focus:outline-none placeholder-muted-foreground text-sm resize-none min-h-[44px] max-h-32 leading-5'
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  maxLength={MAX_CHAR_LIMIT}
                  rows={1}
                />
                {/* Character Counter */}
                {message.length > MAX_CHAR_LIMIT * 0.8 && (
                  <div className='absolute right-3 bottom-2'>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        message.length >= MAX_CHAR_LIMIT
                          ? 'bg-destructive/10 text-destructive'
                          : message.length > MAX_CHAR_LIMIT * 0.9
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.length}/{MAX_CHAR_LIMIT}
                    </span>
                  </div>
                )}
              </div>
            </div>{' '}
            {/* Send Button */}
            <Button
              type='submit'
              variant={message.trim() || imgUrl ? 'default' : 'secondary'}
              size='icon'
              className='h-11 w-11 rounded-full shadow-sm hover:scale-105 transition-transform self-end'
              disabled={
                (!message.trim() && !imgUrl) ||
                loading ||
                message.length > MAX_CHAR_LIMIT
              }
              title='Send Message'
            >
              {loading ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground' />
              ) : (
                <Send className='h-5 w-5' />
              )}
            </Button>
          </form>
        </div>

        {/* Character count warning */}
        {message.length > MAX_CHAR_LIMIT && (
          <div className='px-3 pb-2'>
            <p className='text-xs text-destructive'>
              Message is too long by {message.length - MAX_CHAR_LIMIT}{' '}
              characters
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageInput;
