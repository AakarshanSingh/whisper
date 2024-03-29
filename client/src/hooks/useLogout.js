import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(false);
    setAuthUser(null);
    localStorage.removeItem('whisper');
  };
  return { loading, logout };
};
export default useLogout;
