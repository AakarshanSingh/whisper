const MessageSkeleton = () => {
  // Randomly determine bubble width for more realistic appearance
  const getRandomWidth = () => {
    const sizes = ['w-24', 'w-32', 'w-40', 'w-48', 'w-56'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  return (
    <div className="space-y-4">
      {/* Incoming message skeleton */}
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
        </div>
        <div className={`chat-bubble bg-secondary bg-opacity-60 ${getRandomWidth()}`}>
          <div className="flex flex-col gap-1">
            <div className="skeleton h-3 w-full"></div>
            <div className="skeleton h-3 w-4/5"></div>
          </div>
        </div>
        <div className="chat-footer opacity-50 text-xs">
          <div className="skeleton h-2 w-8"></div>
        </div>
      </div>

      {/* Outgoing message skeleton */}
      <div className="chat chat-end">
        <div className={`chat-bubble bg-message bg-opacity-60 ${getRandomWidth()}`}>
          <div className="flex flex-col gap-1">
            <div className="skeleton h-3 w-full"></div>
            <div className="skeleton h-3 w-3/4"></div>
          </div>
        </div>
        <div className="chat-footer opacity-50 text-xs">
          <div className="skeleton h-2 w-8"></div>
        </div>
      </div>
    </div>
  );
};
export default MessageSkeleton;
