import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(false);
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAuthUser(null);
      localStorage.removeItem('whisper');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return { loading, logout };
};
export default useLogout;
