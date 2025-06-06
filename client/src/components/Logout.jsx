import { LogOut } from 'lucide-react';
import useLogout from '../hooks/useLogout';
import { Button } from './ui/Button';

const Logout = () => {
  const { loading, logout } = useLogout();
  return (
    <Button
      onClick={logout}
      disabled={loading}
      variant='destructive'
      className='w-full justify-start gap-2 p-3 h-auto bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/40 text-destructive hover:text-destructive-foreground transition-all duration-200 rounded-lg shadow-sm hover:shadow-md'
    >
      {loading ? (
        <div className='animate-spin rounded-full h-4 w-4 border-2 border-destructive border-t-transparent' />
      ) : (
        <LogOut className='w-4 h-4' />
      )}
      <span className='font-semibold text-sm'>
        {loading ? 'Logging out...' : 'Logout'}
      </span>
    </Button>
  );
};

export default Logout;
