import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="md:w-full m-10 w-4/5 p-6 rounded-lg shadow-sm bg-secondary bg-clip-padding">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className="input w-full input-bordered h-10 bg-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="input w-full input-bordered h-10 bg-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to="/register"
            className="text-sm hover:text-message mt-2 inline-block"
          >
            {"Don't"} have an account ? Register Now
          </Link>
          <button type="submit" className="btn btn-block btn-primary mt-3">
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
