import { useState } from 'react';
import { Link } from 'react-router-dom';
import useRegister from '../hooks/useRegister';

const Register = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { loading, register } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="md:w-full w-4/5 p-6 rounded-lg shadow-sm bg-secondary bg-clip-padding">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Register
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="input w-full input-bordered h-10 bg-primary"
              value={inputs.fullName}
              onChange={(e) =>
                setInputs({ ...inputs, fullName: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="username" className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter a username"
              className="input w-full input-bordered h-10 bg-primary"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
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
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="input w-full input-bordered h-10 bg-primary"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
          </div>
          <Link
            to="/login"
            className="text-sm hover:text-message mt-2 inline-block"
          >
            Already have an account ? Login
          </Link>

          <button
            type="submit"
            className="btn btn-block btn-primary mt-3"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
