import { useEffect, useState } from 'react';
import MessageContainer from '../components/MessageContainer';
import Sidebar from '../components/Sidebar';
import SearchModal from '../components/SearchModal';

const Homepage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <>
      <div className="flex h-screen w-screen bg-gray-900 overflow-hidden">
        <div className="w-80 min-w-80 max-w-80 flex-shrink-0 overflow-hidden">
          <Sidebar onOpenSearchModal={() => setIsSearchModalOpen(true)} />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <MessageContainer />
        </div>
      </div>
      
      {/* Global Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
};

export default Homepage;
