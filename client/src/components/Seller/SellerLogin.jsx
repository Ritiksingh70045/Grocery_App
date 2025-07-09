import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

function SellerLogin() {
    const { setSeller , setShowSellerLogin, axios, navigate } = useAppContext();

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const payload =
        state === 'register'
          ? { name, email, password, phone, address }
          : { email, password };

      const { data } = await axios.post(`/api/seller/${state}`, payload);

      if (data.success) {
        toast.success(`${state === 'register' ? 'Registered' : 'Logged in'} successfully`);
        setSeller(data.seller);
        navigate('/seller');
        setShowSellerLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowSellerLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center justify-center bg-black/50 text-sm text-gray-600"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Seller</span>{' '}
          {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Your name"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                required
              />
            </div>
            <div className="w-full">
              <p>Phone</p>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                placeholder="Phone number"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="tel"
                required
              />
            </div>
            <div className="w-full">
              <p>Address</p>
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                placeholder="Business address"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                required
              />
            </div>
          </>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email address"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {state === 'register' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('login')}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setState('register')}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
          <p> 
          </p>
          Forgot Password?{' '}
          <span
            onClick={() => navigate('/forgot-password-seller')}
            className="text-primary cursor-pointer"
          >
            click here
          </span>
          </p>
        )}

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default SellerLogin;
