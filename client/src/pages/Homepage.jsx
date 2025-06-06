import { useEffect, useState } from 'react';
import MessageContainer from '../components/MessageContainer';
import Sidebar from '../components/Sidebar';
import SearchModal from '../components/SearchModal';

const Homepage = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
      <div className='flex h-screen w-screen overflow-hidden bg-background dark'>
        <div className='w-80 min-w-80 max-w-80 flex-shrink-0 overflow-hidden border-r border-border shadow-xl bg-card/30 backdrop-blur-sm'>
          <Sidebar onOpenSearchModal={() => setIsSearchModalOpen(true)} />
        </div>

        <div className='flex-1 min-w-0 overflow-hidden bg-background/50'>
          <MessageContainer />
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Homepage;
