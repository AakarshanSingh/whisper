import useGetConversations from '../hooks/useGetConversations';
import Conversation from './Conversation';

const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">No conversations yet</p>
          <p className="text-muted-foreground text-xs mt-1">Start chatting with someone!</p>
        </div>
      ) : (
        conversations.map((conversation, index) => (
          <Conversation
            key={conversation._id}
            conversation={conversation}
            lastIndex={index === conversations.length - 1}
          />
        ))
      )}
    </div>
  );
};

export default Conversations;
