import { useState } from 'react';
import { Link } from 'react-router-dom';
import useRegister from '../hooks/useRegister';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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
    <div className='flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/10'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            Whisper
          </h1>
          <p className='text-muted-foreground text-base sm:text-lg'>
            Join the conversation
          </p>
        </div>

        <div className='bg-card/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border/30 shadow-2xl'>
          <h2 className='text-2xl sm:text-3xl font-semibold text-center text-card-foreground mb-6 sm:mb-8'>
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
            <div>
              <label
                htmlFor='fullName'
                className='block text-sm font-medium text-foreground mb-1 sm:mb-2'
              >
                Full Name
              </label>
              <Input
                id='fullName'
                type='text'
                placeholder='Enter your full name'
                value={inputs.fullName}
                onChange={(e) =>
                  setInputs({ ...inputs, fullName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-foreground mb-1 sm:mb-2'
              >
                Username
              </label>
              <Input
                id='username'
                type='text'
                placeholder='Choose a unique username'
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-foreground mb-1 sm:mb-2'
              >
                Password
              </label>
              <Input
                id='password'
                type='password'
                placeholder='Create a secure password'
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-foreground mb-1 sm:mb-2'
              >
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                value={inputs.confirmPassword}
                onChange={(e) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full py-2 sm:py-3'
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent'></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className='mt-6 sm:mt-8 text-center'>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='text-primary hover:text-primary/80 font-medium hover:underline'
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-muted-foreground text-sm'>
            By creating an account, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
