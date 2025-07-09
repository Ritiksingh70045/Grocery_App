import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

function Loading() {
  const { navigate, setCartItems } = useAppContext();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next');
  const success = query.get('success');

  useEffect(() => {
    if (success === 'true') {
      setCartItems({});
    }

    if (nextUrl) {
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 3000); // feel free to reduce to 2–3s if 5s feels too long
    }
  }, [nextUrl, success]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
}

export default Loading;
