import { useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import useSendMessage from '../hooks/useSendMessage';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImage from '../hooks/usePreviewImage';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { loading, sendMessage } = useSendMessage();
  const imageRef = useRef(null);
  let { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  const handleSendImage = async (e) => {
    e.preventDefault();
    if (!imgUrl) {
      return;
    }
    await sendMessage('', imgUrl);
    setImgUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    await sendMessage(message, '');
    setMessage('');
  };

  return (
    <div className="flex flex-col">
      <div
        className={`${
          imgUrl === '' || imgUrl === null ? 'hidden' : ''
        } ml-14 lg:card-side card w-96 bg-base-100 shadow-xl`}
      >
        <figure className="h-fit m-2">
          <img src={imgUrl} alt="Image" className=" rounded-lg" />
        </figure>
        <div className="card-body items-center justify-center">
          <div className="card-actions ">
            <button
              className="btn hover:bg-message bg-secondary border-none text-textColor"
              onClick={handleSendImage}
            >
              {loading ? (
                <div className="loading loading-spinner" />
              ) : (
                <div className="flex flex-row items-center gap-2">
                  <span>Send</span>
                  <IoMdSend className="h-6 w-6" />
                </div>
              )}
            </button>
            <button
              disabled={loading}
              onClick={() => {
                setImgUrl('');
              }}
              className="btn btn-ghost border-none text-textColor"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex cursor-pointer ml-4">
          <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </div>

        <form className="px-4 my-3 w-full" onSubmit={handleSubmit}>
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Write a message"
              className="border text-sm rounded-lg block w-full p-2.5 bg-primary border-secondary text-textColor"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-0 end-0 flex items-center pe-3"
            >
              {loading ? (
                <div className="loading loading-spinner" />
              ) : (
                <IoMdSend className="h-6 w-6" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
