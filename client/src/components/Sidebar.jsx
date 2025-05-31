import Conversations from './Conversations';
import Logout from './Logout';
import SearchInput from './SearchInput';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden border-r border-gray-700/50 bg-gray-800 shadow-xl">
      {/* Header with Search */}
      <div className="p-4 border-b border-gray-700/50 bg-gray-800/80 backdrop-blur-sm flex-shrink-0 shadow-sm">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-100 mb-1">Whisper</h1>
          <p className="text-sm text-gray-400">Your conversations</p>
        </div>
        <SearchInput />
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <Conversations />
      </div>
      
      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm flex-shrink-0 shadow-sm">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
