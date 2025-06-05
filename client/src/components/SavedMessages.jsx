import { Bookmark } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import useConversation from '../zustand/useConversation';

const SavedMessages = () => {
  const { authUser } = useAuthContext();
  const { selectedConversation, setSelectedConversation } = useConversation();
  
  // Create a self-conversation object
  const selfConversation = {
    _id: authUser._id,
    fullName: 'Saved Messages',
    username: authUser.username,
    profilePic: authUser.profilePic,
    isSelf: true
  };
  
  const isSelected = selectedConversation?.isSelf || 
                   (selectedConversation?._id === authUser._id && selectedConversation?.isSelf);

  const handleSelfChat = () => {
    setSelectedConversation(selfConversation);
  };  return (    <div 
      className={`flex items-center gap-3 p-3 mx-2 mb-2 cursor-pointer transition-all duration-300 ease-in-out rounded-lg group ${
        isSelected 
          ? 'bg-accent border border-primary/20 shadow-md' 
          : 'hover:bg-accent/70 hover:shadow-sm'
      }`}
      onClick={handleSelfChat}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
        isSelected 
          ? 'bg-primary/10 border-2 border-primary/30' 
          : 'bg-primary/20 group-hover:bg-primary/30 border-2 border-primary/20 group-hover:border-primary/40'
      }`}>
        <Bookmark className={`w-5 h-5 transition-all duration-300 ${
          isSelected ? 'text-primary' : 'text-primary group-hover:text-primary/80'
        }`} />
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <p className={`font-semibold text-sm transition-colors duration-300 ${
          isSelected ? 'text-accent-foreground' : 'text-foreground group-hover:text-primary'
        }`}>
          Saved Messages
        </p>
        <p className={`text-xs transition-colors duration-300 ${
          isSelected ? 'text-accent-foreground/70' : 'text-muted-foreground group-hover:text-muted-foreground/80'
        }`}>
          Save messages to yourself
        </p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default SavedMessages;
