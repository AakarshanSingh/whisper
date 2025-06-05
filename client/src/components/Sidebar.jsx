import Conversations from './Conversations';
import Logout from './Logout';
import SearchInput from './SearchInput';
import SavedMessages from './SavedMessages';

const Sidebar = ({ onOpenSearchModal }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-card/80 backdrop-blur-md">
      {/* Header with Search */}
      <div className="p-4 border-b border-border/30 flex-shrink-0">        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Whisper
          </h1>
          <p className="text-xs text-muted-foreground font-medium">Your conversations</p>
        </div>
        <SearchInput onOpenModal={onOpenSearchModal} />
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Conversations />
      </div>
      
      {/* Footer with Saved Messages and Logout */}
      <div className="border-t border-border/30 flex-shrink-0 bg-card/90">
        <div className="p-3">
          <SavedMessages />
        </div>
        <div className="px-4 pb-4">
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
