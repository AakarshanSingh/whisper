import { Search, Command } from 'lucide-react';
import { Button } from './ui/Button';

const SearchInput = ({ onOpenModal }) => {
  const handleOpenModal = () => {
    if (onOpenModal) {
      onOpenModal();
    }
  };
  return (
    <Button
      onClick={handleOpenModal}
      variant='ghost'
      className='w-full justify-start gap-2 px-3 py-2 h-auto bg-muted/30 hover:bg-accent text-muted-foreground hover:text-accent-foreground border border-border/20 hover:border-ring transition-all duration-200 rounded-lg shadow-sm hover:shadow-md'
    >
      <Search className='text-base flex-shrink-0' />
      <span className='text-left flex-1 text-sm font-medium'>
        Search conversations...
      </span>
      <div className='flex items-center gap-1 text-xs text-muted-foreground bg-background/30 px-1.5 py-0.5 rounded-md'>
        <Command className='text-xs' />
        <span className='font-semibold'>K</span>
      </div>
    </Button>
  );
};

export default SearchInput;
