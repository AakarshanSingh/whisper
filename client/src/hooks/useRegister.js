import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';

const useRegister = () => {
  const [loading, setLoading] = useState(false);

  const { setAuthUser } = useAuthContext();

  const register = async ({
    fullName,
    username,
    password,
    confirmPassword,
  }) => {
    if (!fullName || !username || !password || !confirmPassword) {
      toast.error('Please enter all values');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be greater than 6');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/register`, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ fullName, username, password, confirmPassword }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem('whisper', JSON.stringify(data));

      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return { loading, register };
};
export default useRegister;
