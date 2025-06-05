import { HiBookmark } from 'react-icons/hi';
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
  };

  return (
    <div 
      className={`flex items-center gap-3 p-3 mx-2 mb-2 cursor-pointer transition-all duration-200 ease-in-out rounded-xl ${
        isSelected 
          ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-l-4 border-blue-500' 
          : 'hover:bg-gray-700/50 hover:translate-x-1'
      }`}
      onClick={handleSelfChat}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-500/20 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
          : 'bg-gray-700 hover:bg-gray-600'
      }`}>
        <HiBookmark className={`w-6 h-6 transition-colors duration-200 ${
          isSelected ? 'text-blue-400' : 'text-gray-300'
        }`} />
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <p className={`font-semibold text-base transition-colors duration-200 ${
          isSelected ? 'text-blue-400' : 'text-gray-100'
        }`}>
          Saved Messages
        </p>
        <p className={`text-sm transition-colors duration-200 ${
          isSelected ? 'text-gray-300' : 'text-gray-400'
        }`}>
          Save messages to yourself
        </p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
      )}
    </div>
  );
};

export default SavedMessages;
