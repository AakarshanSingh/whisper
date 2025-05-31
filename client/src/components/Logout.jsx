import { CiLogout } from 'react-icons/ci';
import useLogout from '../hooks/useLogout';

const Logout = () => {
  const { loading, logout } = useLogout();
  
  return (
    <button
      onClick={logout}
      disabled={loading}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-700/50 hover:bg-red-600/20 border border-gray-600/50 hover:border-red-500/50 text-gray-300 hover:text-red-400 transition-all duration-200 group"
    >
      {loading ? (
        <div className="loading loading-spinner loading-sm" />
      ) : (
        <CiLogout className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      )}
      <span className="font-medium">
        {loading ? 'Logging out...' : 'Logout'}
      </span>
    </button>
  );
};

export default Logout;
