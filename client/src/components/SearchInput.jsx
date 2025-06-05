import { CiSearch } from 'react-icons/ci';
import { HiCommandLine } from 'react-icons/hi2';

const SearchInput = ({ onOpenModal }) => {
  const handleOpenModal = () => {
    if (onOpenModal) {
      onOpenModal();
    }
  };

  return (
    <button
      onClick={handleOpenModal}
      className='w-full flex items-center gap-3 px-4 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-gray-100 rounded-xl transition-all duration-200 group border border-gray-600/30 hover:border-gray-500/50'
    >
      <CiSearch className='text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200' />
      <span className='text-left flex-1 text-sm'>Search conversations...</span>
      <div className='flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-400'>
        <HiCommandLine className='text-sm' />
        <span>K</span>
      </div>
    </button>
  );
};

export default SearchInput;
